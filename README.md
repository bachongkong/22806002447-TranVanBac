# Smart Recruitment Platform

Nen tang tuyen dung thong minh - ho tro ung vien tim viec, HR quan ly tuyen dung, Admin quan tri he thong.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Vite, TanStack Query, Zustand, React Hook Form, Zod, Socket.io Client |
| Backend | Node.js, Express 5, Mongoose, JWT, Joi, Socket.io, Bcrypt |
| Database | MongoDB |

## Project Structure

```
recruitment-platform/
├── src/
│   ├── frontend/          # React SPA (Vite)
│   │   ├── src/
│   │   │   ├── app/       # Router, stores, providers
│   │   │   ├── features/  # Business modules
│   │   │   ├── shared/    # Reusable components, hooks, services
│   │   │   ├── layouts/   # Page shells
│   │   │   └── pages/     # Page components
│   │   └── docs/          # Frontend development docs
│   │
│   └── backend/           # Express API
│       ├── src/
│       │   ├── config/    # Env, database connection
│       │   ├── common/    # ApiError, ApiResponse, constants
│       │   ├── middleware/ # Auth, validation, error handler
│       │   ├── models/    # Mongoose schemas
│       │   ├── modules/   # Route + controller + validation per feature
│       │   ├── routes/    # Central router
│       │   ├── sockets/   # Socket.io setup
│       │   └── utils/     # JWT helpers
│       └── docs/          # Backend development docs
│
└── docs/                  # Project-level docs
```

## Features

- **Auth**: Register, login, JWT (access + refresh token), email verification
- **Candidate**: Tim viec, ung tuyen, quan ly CV (upload + builder + OCR), theo doi don
- **HR**: Dang tin, quan ly ung vien, dat lich phong van, nhan xet
- **Admin**: Duyet cong ty, duyet tin tuyen dung, quan ly user, dashboard thong ke
- **Realtime**: Notification va chat qua Socket.io

## Roles

| Role | Quyen |
|------|-------|
| Candidate | Tim viec, ung tuyen, quan ly CV, chat voi HR |
| HR | Dang tin tuyen dung, quan ly ung vien, phong van |
| Admin | Duyet cong ty/job, khoa user, xem thong ke |

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local hoac Atlas)

### Backend

```bash
cd src/backend
npm install
cp .env.example .env     # sua MONGODB_URI
npm run seed              # tao data mau
npm run dev               # http://localhost:5000
```

### Frontend

```bash
cd src/frontend
npm install
npm run dev               # http://localhost:3000
```

### Test Accounts (sau khi seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@smarthire.com | admin123 |
| HR | hr@techcorp.com | hr123456 |
| Candidate | candidate@gmail.com | candidate123 |

## API

Health check: `GET /api/health`

Chi tiet endpoints: xem [Backend API Docs](src/backend/docs/API_ENDPOINTS.md)

## Documentation

| Doc | Mo ta |
|-----|-------|
| [Backend Architecture](src/backend/docs/ARCHITECTURE.md) | Kien truc backend |
| [Backend Coding Standards](src/backend/docs/CODING_STANDARDS.md) | Quy tac code backend |
| [Backend Dev Guide](src/backend/docs/DEVELOPMENT_GUIDE.md) | Huong dan them module |
| [API Endpoints](src/backend/docs/API_ENDPOINTS.md) | Bang tham chieu API |
| [Database Schema](src/backend/docs/DATABASE_SCHEMA.md) | Schema MongoDB |
| [Frontend Architecture](src/frontend/docs/ARCHITECTURE.md) | Kien truc frontend |
| [Frontend Coding Standards](src/frontend/docs/CODING_STANDARDS.md) | Quy tac code frontend |
| [Frontend Dev Guide](src/frontend/docs/DEVELOPMENT_GUIDE.md) | Huong dan them page/feature |
| [API Integration](src/frontend/docs/API_INTEGRATION.md) | Cach goi API |
| [State Management](src/frontend/docs/STATE_MANAGEMENT.md) | Chon dung state |
| [Feature Checklist](src/frontend/docs/FEATURE_CHECKLIST.md) | Checklist khi lam feature |

## License

ISC