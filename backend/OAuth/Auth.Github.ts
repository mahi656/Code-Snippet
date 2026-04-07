import { Router, Request, Response } from 'express';
import axios from 'axios';

class GithubAuthRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/github', this.githubLogin);
        this.router.get('/github/callback', this.githubCallback);
    }

    private githubLogin(req: Request, res: Response): void {
        const clientId = process.env.GITHUB_CLIENT_ID;
        const redirectUri = encodeURIComponent('http://localhost:5001/OAuth/github/callback');
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user,user:email`;
        res.redirect(githubAuthUrl);
    }

    private async githubCallback(req: Request, res: Response): Promise<void> {
        const code = req.query.code as string;
        const clientId = process.env.GITHUB_CLIENT_ID;
        const clientSecret = process.env.GITHUB_CLIENT_SECRET;

        try {
            const tokenResponse = await axios.post(
                'https://github.com/login/oauth/access_token',
                { client_id: clientId, client_secret: clientSecret, code },
                { headers: { Accept: 'application/json' } }
            );
            const accessToken = tokenResponse.data.access_token;

            const userResponse = await axios.get('https://api.github.com/user', {
                headers: { Authorization: `token ${accessToken}` }
            });
            const userData = userResponse.data;

            res.redirect(`http://localhost:5173/dashboard?githubUser=${encodeURIComponent(userData.login)}`);
        } catch (err: any) {
            console.error('OAuth Error:', err.message);
            res.redirect('http://localhost:5173/login?error=oauth_failed');
        }
    }
}

export default new GithubAuthRoutes().router;
