# Backend — Smart Recruitment Platform

Express API backend xay dung tren Node.js, RESTful va Modular MVC pattern.

## Tech Stack

- **Framework**: Node.js, Express 5
- **Database**: MongoDB (Mongoose 9)
- **Authentication**: JWT (JSON Web Tokens), bcryptjs
- **Validation**: Joi
- **Realtime**: Socket.io
- **Security & Utils**: cors, cookie-parser, dotenv
- **Standard**: ES Modules

## Setup & Chay local

Yeu cau: Node.js 18+ va MongoDB (local URL hoac Atlas).

```bash
# 1. Cai dat dependencies
npm install

# 2. Cau hinh environment
cp .env.example .env
# Sua MONGODB_URI trong file .env neu can thiet

# 3. Chay seed de tao data mau (neu chua co data)
npm run seed

# 4. Khoi dong server
npm run dev
```

Server se chay tren port `5000` mac dinh: `http://localhost:5000`

## Kiem tra APIs (Health & Seed Data)
- **Health check**: `GET http://localhost:5000/api/health`
- **Taikhoan test**:
  - Admin: `admin@smarthire.com` / `admin123`
  - HR: `hr@techcorp.com` / `hr123456`
  - Candidate: `candidate@gmail.com` / `candidate123`

## Project Structure

```
src/
├── config/         # Cau hinh moi truong, database
├── common/         # Code xai chung (Errors, Responses chuẩn, constants)
├── middleware/     # global error handler, auth, validate, asyncHandler
├── models/         # Mongoose schema definitions
├── modules/        # Business logic modules (auth, job, cv, application...)
│   └── [module-name]/
│       ├── [module-name].controller.js
│       ├── [module-name].routes.js
│       └── [module-name].validation.js
├── routes/         # Central router (load routes tu cac modules)
├── sockets/        # Realtime WebSocket logic
├── utils/          # Helpers (tuong tac jwt, format text...)
├── seeds/          # Data seed initial (Admin roles, Jobs basic)
└── server.js       # Express App entry point
tests/
├── unit/
│   ├── config/
│   ├── middleware/
│   │   ├── auth.middleware.test.js
│   │   ├── rbac.middleware.test.js
│   │   └── validate.middleware.test.js
│   ├── utils/
│   │   ├── jwt.util.test.js
│   │   └── text.util.test.js
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── register.service.test.js
│   │   │   ├── login.service.test.js
│   │   │   ├── verify-email.service.test.js
│   │   │   ├── reset-password.service.test.js
│   │   │   └── logout.service.test.js
│   │   ├── profile/
│   │   │   ├── profile.service.test.js
│   │   │   └── upload-avatar.service.test.js
│   │   ├── company/
│   │   │   ├── manage-company.service.test.js
│   │   │   ├── hr-members.service.test.js
│   │   │   └── moderate-company.service.test.js
│   │   ├── cv/
│   │   │   ├── cv.service.test.js
│   │   │   ├── cv-default.service.test.js
│   │   │   └── cv-parsing-orchestrator.test.js
│   │   ├── job/
│   │   │   ├── job-post.service.test.js
│   │   │   ├── job-search.service.test.js
│   │   │   └── job-detail.service.test.js
│   │   ├── application/
│   │   │   ├── apply-job.service.test.js
│   │   │   ├── idempotency.service.test.js
│   │   │   └── application-status-history.service.test.js
│   │   ├── interview/
│   │   │   ├── interview-schedule.service.test.js
│   │   │   └── interview-feedback.service.test.js
│   │   ├── realtime/
│   │   │   ├── notification.service.test.js
│   │   │   ├── chat-history.service.test.js
│   │   │   ├── chat-message.service.test.js
│   │   │   └── socket-auth.helper.test.js
│   │   ├── saved-job/
│   │   │   └── toggle-saved-job.service.test.js
│   │   ├── admin/
│   │   │   ├── moderate-users.service.test.js
│   │   │   ├── audit-log.service.test.js
│   │   │   ├── import-master-data.service.test.js
│   │   │   └── export-large-data.service.test.js
│   │   └── report/
│   │       ├── dashboard-aggregate.service.test.js
│   │       └── report-filter-builder.test.js
│   └── helpers/
│       ├── factories/
│       │   ├── user.factory.js
│       │   ├── company.factory.js
│       │   ├── job.factory.js
│       │   └── application.factory.js
│       ├── mocks/
│       │   ├── req-res-next.mock.js
│       │   ├── jwt.mock.js
│       │   ├── bcrypt.mock.js
│       │   ├── mail-service.mock.js
│       │   ├── queue.mock.js
│       │   └── socket.mock.js
│       ├── setup/
│       │   ├── jest.setup.js
│       │   └── env.setup.js
│       └── builders/
│           ├── token.builder.js
│           └── payload.builder.js
├── integration/
│   ├── auth/
│   ├── job/
│   ├── application/
│   └── health/
└── coverage/
```

## Documentation

Doi ngu Backend doc cac tai lieu ben duoi thu muc `docs/` de hieu chi tiet cach to chuc:

| Document | Mo ta |
|----------|-------|
| [Architecture](docs/ARCHITECTURE.md) | Tong quan ve kien truc phan chia cac tang |
| [Coding Standards](docs/CODING_STANDARDS.md) | Quy tac lam viec, logic, cach return |
| [Development Guide](docs/DEVELOPMENT_GUIDE.md) | Huong dan them / sua 1 feature tu A den Z |
| [Database Schema](docs/DATABASE_SCHEMA.md) | Cau truc du lieu, index va reference collections |
| [API Endpoints](docs/API_ENDPOINTS.md) | Mapping cac API va Role phan quyen |
