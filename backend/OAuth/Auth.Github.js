const express = require('express')
const app = express()
const axios = require('axios')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()
app.use(cors())

app.get('/auth/github', (req, res) => {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = encodeURIComponent('http://localhost:5000/auth/github/callback');
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user,user:email`;
    res.redirect(githubAuthUrl);
});

app.get('/auth/github/callback', async (req, res) => {
    const code = req.query.code;
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    try {
        // Exchange code for access token
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            { client_id: clientId, client_secret: clientSecret, code },
            { headers: { Accept: 'application/json' } }
        )

        const accessToken = tokenResponse.data.access_token;

        // Get user info
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `token ${accessToken}` }
        })
        const userData = userResponse.data;

        // Redirect to frontend dashboard with github user 
        res.redirect(`http://localhost:5173/dashboard?githubUser=${encodeURIComponent(userData.login)}`);
    } catch (err) {
        console.error('OAuth Error:', err.message);
        res.redirect('http://localhost:5173/login?error=oauth_failed');
    }
});

app.listen(5000, () => console.log('Backend GitHub Auth service running on port 5000'));