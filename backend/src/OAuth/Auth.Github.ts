import { Router, Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import User from '../Auth/auth.model';

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

    private normalizeUrl = (url: string): string => {
        return url.replace(/\/+$/, '');
    };

    private githubLogin = (req: Request, res: Response): void => {
        const clientId = process.env.GITHUB_CLIENT_ID;
        const backendUrl = process.env.BACKEND_URL
            ? this.normalizeUrl(process.env.BACKEND_URL)
            : `${req.protocol}://${req.get('host')}`;
        const redirectUri = encodeURIComponent(`${backendUrl}/OAuth/github/callback`);
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user,user:email`;
        res.redirect(githubAuthUrl);
    };

    private githubCallback = async (req: Request, res: Response): Promise<void> => {
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

            let user = await User.findOne({ githubId: userData.id.toString() });
            
            if (!user) {
                user = new User({
                    githubId: userData.id.toString(),
                    username: userData.login,
                    fullName: userData.name || userData.login,
                    avatar_url: userData.avatar_url,
                    bio: userData.bio,
                    followers: userData.followers,
                    public_repos: userData.public_repos
                });
                await user.save();
            } else {
                // Update user info from GitHub in case it changed
                user.username = userData.login;
                user.fullName = userData.name || user.fullName || userData.login;
                user.avatar_url = userData.avatar_url;
                user.bio = userData.bio;
                user.followers = userData.followers;
                user.public_repos = userData.public_repos;
                await user.save();
            }

            const payload = {
                user: {
                    id: user.id
                }
            };
            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET is not defined');
            }
            const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

            const clientUrl = this.normalizeUrl(
                process.env.FRONTEND_URL || `http://${req.get('host')?.split(':')[0]}:5173`
            );
            const redirectParams = new URLSearchParams({
                token: jwtToken,
                username: user.username,
                fullName: user.fullName || ''
            });
            res.redirect(`${clientUrl}/dashboard?${redirectParams.toString()}`);
        } catch (err: any) {
            console.error('OAuth Error:', err.message);
            const clientUrl = this.normalizeUrl(
                process.env.FRONTEND_URL || `http://${req.get('host')?.split(':')[0]}:5173`
            );
            res.redirect(`${clientUrl}/login?error=oauth_failed`);
        }
    };
}

export default new GithubAuthRoutes().router;
