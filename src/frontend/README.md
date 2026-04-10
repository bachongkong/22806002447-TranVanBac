# Frontend — Smart Recruitment Platform

React SPA xay dung tren Vite, theo kien truc Feature-Based.

## Tech Stack

- React 19 + Vite
- React Router DOM (routing + RBAC)
- TanStack Query (server state)
- Zustand (client state)
- Axios (HTTP client)
- React Hook Form + Zod (form + validation)
- Socket.io Client (realtime)
- React Hot Toast (notifications)
- React Icons
- Day.js

## Setup

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
```

## Project Structure

```
src/
├── app/              # Router, stores, providers
│   ├── providers/    # AppProvider (QueryClient, Router, Toast)
│   ├── router/       # AppRouter (routes chia theo role)
│   └── store/        # authStore, uiStore (Zustand)
├── features/         # Business modules (self-contained)
│   ├── auth/
│   ├── jobs/
│   ├── companies/
│   ├── applications/
│   ├── cvs/
│   ├── interviews/
│   ├── notifications/
│   ├── chat/
│   ├── admin/
│   └── candidate/
├── shared/           # Reusable code
│   ├── components/   # Button, Modal, LoadingSpinner, ProtectedRoute
│   ├── hooks/        # useDebounce, useDocumentTitle
│   ├── services/     # apiClient, apiEndpoints
│   ├── constants/    # ROLES, enums
│   └── utils/        # formatDate, formatSalary
├── layouts/          # Page shells (MainLayout, CandidateLayout, HRLayout, AdminLayout)
├── pages/            # Page components (chia theo role)
├── assets/           # Static files
├── App.jsx
├── main.jsx
└── index.css         # Design system (CSS variables)
```

## Path Aliases

| Alias | Path |
|-------|------|
| `@/` | `src/` |
| `@app` | `src/app/` |
| `@features` | `src/features/` |
| `@shared` | `src/shared/` |
| `@layouts` | `src/layouts/` |
| `@pages` | `src/pages/` |
| `@assets` | `src/assets/` |

## Routing

| Group | Guard | Layout |
|-------|-------|--------|
| Public | None | MainLayout |
| Candidate | ProtectedRoute (candidate) | CandidateLayout |
| HR | ProtectedRoute (hr) | HRLayout |
| Admin | ProtectedRoute (admin) | AdminLayout |

## Docs

- [Architecture](docs/ARCHITECTURE.md)
- [Coding Standards](docs/CODING_STANDARDS.md)
- [Development Guide](docs/DEVELOPMENT_GUIDE.md)
- [API Integration](docs/API_INTEGRATION.md)
- [State Management](docs/STATE_MANAGEMENT.md)
- [Feature Checklist](docs/FEATURE_CHECKLIST.md)
