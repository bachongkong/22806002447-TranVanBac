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
