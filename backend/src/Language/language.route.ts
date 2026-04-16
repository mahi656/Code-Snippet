import { Router } from 'express';
import LanguageController from './language.controller';
import { authMiddleware } from '../Auth/auth.middleware';

const router = Router();

// Protect all language routes
router.use(authMiddleware as any);

// Get all unique languages (auto-derived from snippets)
router.get('/', LanguageController.getMyLanguages);

// Get snippets filtered by language name
router.get('/:languageName/snippets', LanguageController.getSnippetsByLanguage);

export default router;
