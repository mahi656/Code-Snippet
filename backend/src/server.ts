import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import Database from './config/db';
import AuthRoutes from './Auth/auth.route';
import GithubAuthRoutes from './OAuth/Auth.Github';
import SnippetRoutes from './Snippet/snippet.route';
import VersionRoutes from './Version/version.route';
import FavoriteRoutes from './Favorite/favorite.route';
import CalendarRoutes from './Calendar/calendar.route';
import TagRoutes from './Tag/tag.route';
import LanguageRoutes from './Language/language.route';
import SearchRoutes from './Search/search.route';
import TrashRoutes from './Trash/trash.route';
import DashboardRoutes from './Dashboard/dashboard.route';
import UploadRoutes from './Upload/upload.route';
import SharedRoutes from './Shared/share.route';
import { errorMiddleware } from './middlewares/error.middleware';

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
        this.initializeErrorHandling();
    }

    private connectToDatabase(): void {
        Database.connect();
    }

    private initializeMiddlewares(): void {
        this.app.use(cors());
        this.app.use(express.json());

        // Serve uploaded files as static assets
        this.app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));
    }

    private initializeRoutes(): void {
        this.app.use('/auth', AuthRoutes);
        this.app.use('/OAuth', GithubAuthRoutes);
        this.app.use('/api/snippets', SnippetRoutes);
        this.app.use('/api/versions', VersionRoutes);
        this.app.use('/api/favorites', FavoriteRoutes);
        this.app.use('/api/calendar', CalendarRoutes);
        this.app.use('/api/tags', TagRoutes);
        this.app.use('/api/languages', LanguageRoutes);
        this.app.use('/api/search', SearchRoutes);
        this.app.use('/api/trash', TrashRoutes);
        this.app.use('/api/dashboard', DashboardRoutes);
        this.app.use('/api/upload', UploadRoutes);
        this.app.use('/api/shared', SharedRoutes);
    }

    private initializeErrorHandling(): void {
        this.app.use(errorMiddleware);
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

const server = new App();
server.listen();
