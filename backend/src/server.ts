import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Database from './config/db';
import AuthRoutes from './Auth/auth.route';
import GithubAuthRoutes from './OAuth/Auth.Github';
import SnippetRoutes from './Snippet/snippet.route';
import VersionRoutes from './Version/version.route';

dotenv.config();

class App {
    public app: Application;
    public port: number | string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 5001;

        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes();
    }

    private connectToDatabase(): void {
        Database.connect();
    }

    private initializeMiddlewares(): void {
        this.app.use(cors());
        this.app.use(express.json());
    }

    private initializeRoutes(): void {
        this.app.use('/auth', AuthRoutes);
        this.app.use('/OAuth', GithubAuthRoutes);
        this.app.use('/api/snippets', SnippetRoutes);
        this.app.use('/api/versions', VersionRoutes);
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

const server = new App();
server.listen();
