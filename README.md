# CodeSnippet Platform
## Developer Snippet Management and Productivity System

CodeSnippet Platform is a full-stack developer productivity application for managing code snippets, version history, calendar milestones, and workspace insights.

The project is engineered using SESD principles: clear module boundaries, scalable service design, and maintainable full-stack architecture focused on reliability and developer workflow.

It combines snippet lifecycle management, version snapshots, search, tagging, favorites, trash recovery, sharing, and calendar activity tracking behind a secure authentication system.

## Deployment

| Service | URL |
|---|---|
| Frontend | [https://code-snippet-olive.vercel.app](https://code-snippet-olive.vercel.app) |
| Backend | [https://code-snippet-jb3k.onrender.com](https://code-snippet-jb3k.onrender.com) |

Backend runs on Render free tier, so first request after inactivity may take some time.

## What It Does

- Create, edit, and organize code snippets by title, language, and tags.
- Save and restore version history for snippets.
- Mark snippets as favorites for quick access.
- Soft-delete snippets into trash, then restore or permanently delete.
- Add calendar milestones and view activity summary by date range.
- Share snippets with tokenized public links.
- Sign in with credentials or GitHub OAuth.

## How It Works

```text
User authentication
      |
      |-- Email/password login (JWT)
      |-- GitHub OAuth callback (JWT)
      |-- Store token in client and open dashboard

Snippet lifecycle
      |
      |-- Create / update snippet
      |-- Save snippet metadata (title, tags, language, visibility)
      |-- (optional) Create version snapshot
      |
      |-- Organize via tags, language, favorites
      |-- Search snippets across workspace
      |
      |-- Delete action moves snippet to trash
            |
            |-- Restore from trash
            |-- Permanently delete

Calendar & activity flow
      |
      |-- Create milestone event tied to work timeline
      |-- Fetch monthly events for calendar grid
      |-- Fetch date-range activity summary
      |-- Render daily milestones + system activity insights

Sharing flow
      |
      |-- Generate share link for snippet
      |-- Access public snippet by secure token
      |-- Deactivate share link when no longer needed

Dashboard analytics
      |
      |-- Aggregate user snippet stats
      |-- Provide high-level workspace insights
```

## Tech Stack

### Backend
| Area | Technology |
|---|---|
| Language | TypeScript |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT + bcrypt + GitHub OAuth |
| File uploads | Multer |
| Runtime tooling | ts-node-dev |

### Frontend
| Area | Technology |
|---|---|
| Framework | React + Vite |
| Routing | React Router |
| Styling | Tailwind CSS |
| UI Components | Radix UI + custom components |
| Animation | Framer Motion |
| Date handling | date-fns |
| API client | Axios |

### Infrastructure
| Service | Provider |
|---|---|
| Frontend hosting | Vercel |
| Backend hosting | Render |
| Database | MongoDB Atlas |

## Architecture

Backend is organized by feature modules (Auth, Snippet, Version, Favorite, Calendar, Tag, Language, Search, Trash, Dashboard, Upload, Shared).

Each module follows separation of responsibilities:

- Controller: handles request/response
- Service: business logic
- Model + utilities: persistence and shared helpers

Cross-cutting concerns:
- Central error middleware
- Route-level auth middleware
- CORS origin validation using `FRONTEND_URL`

### Design Principles Used (TypeScript + OOP)

> **Principles Box**
>
> Abstraction  
> Encapsulation  
> Inheritance  
> Polymorphism  
> SOLID (SRP, OCP, LSP, ISP, DIP)  
> Separation of Concerns  
> Modularity  
> Layered Architecture  
> DRY  
> KISS

## API Overview

### Auth & Identity
- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/:username` (protected)
- `GET /OAuth/github`
- `GET /OAuth/github/callback`

### Snippets & Versions
- `POST /api/snippets`
- `GET /api/snippets`
- `GET /api/snippets/:id`
- `PUT /api/snippets/:id`
- `DELETE /api/snippets/:id`
- `POST /api/versions`
- `GET /api/versions`
- `GET /api/versions/snippets/:snippetId`
- `GET /api/versions/:id`
- `DELETE /api/versions/:id`

### Organization & Discovery
- `GET /api/search`
- `GET /api/tags`
- `GET /api/tags/:tagName/snippets`
- `GET /api/languages`
- `GET /api/languages/:languageName/snippets`
- `POST /api/favorites`
- `GET /api/favorites`
- `DELETE /api/favorites/:snippetId`

### Calendar & Dashboard
- `POST /api/calendar/events`
- `GET /api/calendar/events`
- `GET /api/calendar/activity`
- `DELETE /api/calendar/events/:id`
- `GET /api/calendar/snippets`
- `GET /api/dashboard`

### Trash, Uploads, Sharing
- `GET /api/trash`
- `PATCH /api/trash/:id/restore`
- `DELETE /api/trash/:id`
- `DELETE /api/trash`
- `POST /api/upload`
- `DELETE /api/upload/:filename`
- `POST /api/shared`
- `GET /api/shared`
- `GET /api/shared/public/:token`
- `PATCH /api/shared/:id/deactivate`

## Version 1 (Current)

What is implemented:

- Full snippet CRUD with tags/language classification.
- Version history create/read/delete for snippets.
- Favorites, search, and filtered browsing by tag/language.
- Trash workflow: soft delete, restore, permanent delete, empty trash.
- Calendar milestones and activity summaries.
- JWT auth + GitHub OAuth support.
- Share links with public token access and deactivation.
- Dashboard stats endpoint and integrated frontend analytics views.
- Deployed frontend + backend + cloud database setup.

Known gaps:

- Test coverage is minimal and needs expansion.
- Realtime updates are not websocket-driven yet.
- Some modules can be further standardized into strict repository classes.

## Local Development

### 1) Backend
```bash
cd backend
npm install
npm run dev
```

Required `backend/.env` keys:
- `MONGO_URL`
- `JWT_SECRET`
- `FRONTEND_URL` (use `http://localhost:5173` in local)
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
```

App runs at:
- `http://localhost:5173`

## Engineering Documents

- [Project Idea](./idea.md)
- [Use Case Diagram](./useCaseDiagram.md)
- [Sequence Diagram](./sequenceDiagram.md)
- [Class Diagram](./classDiagram.md)
- [ER Diagram](./ErDiagram.md)

## Current Gaps / Next Steps

- Add formal automated test coverage (backend + frontend).
- Improve real-time updates (reduce polling where possible).
- Expand notification channels beyond current auth/share workflows.
- Add stronger observability and API rate limiting.

## License

MIT
