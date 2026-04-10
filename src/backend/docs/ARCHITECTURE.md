# Backend Architecture

## 1. Tong quan

Backend theo mo hinh **Modular MVC** — moi module (auth, job, application...) tu chua controller, routes, validation.

```
src/backend/src/
├── config/         <- Cau hinh (env, database connection)
├── common/         <- Code dung chung (ApiError, ApiResponse, constants)
├── middleware/     <- Express middleware (auth, validate, errorHandler)
├── models/         <- Mongoose schemas
├── modules/        <- Business modules (moi module = route + controller + validation)
│   ├── auth/
│   ├── user/
│   ├── company/
│   ├── job/
│   ├── application/
│   ├── cv/
│   ├── interview/
│   ├── notification/
│   ├── chat/
│   └── admin/
├── routes/         <- Central router (mount tat ca module routes)
├── sockets/        <- Socket.io setup
├── utils/          <- Helper functions (jwt, email...)
└── server.js       <- Entry point
```

## 2. Request Lifecycle

```
Client Request
  -> Express middleware (cors, json, cookie-parser)
    -> Route matching (/api/auth/login)
      -> Middleware chain: validate -> authenticate -> authorize
        -> Controller (business logic)
          -> Model (database)
            -> ApiResponse.success(res, { data })

Error xay ra o bat ky buoc nao
  -> asyncHandler catch
    -> errorHandler middleware
      -> Chuan hoa error response { success: false, message }
```

## 3. Quy tac phan chia

### `config/`
- `env.js` — Single source cho environment variables
- `database.js` — MongoDB connection

### `common/`
- `ApiError.js` — Custom error class voi static factories
- `ApiResponse.js` — Chuan hoa response format
- `constants.js` — Business enums (ROLES, STATUS...)

### `middleware/`
| Middleware | Muc dich |
|-----------|----------|
| `errorHandler` | Global catch, normalize Mongoose/JWT/custom errors |
| `authenticate` | Verify JWT tu Authorization header -> `req.user` |
| `authorize(...roles)` | Check role sau authenticate |
| `validate(schema)` | Validate body/query/params bang Joi |
| `asyncHandler(fn)` | Wrap async route handlers, auto catch errors |

### `models/`
Moi file = 1 Mongoose model. Deu export default.

### `modules/`
Moi module co cau truc:
```
modules/auth/
├── auth.controller.js    <- Business logic
├── auth.routes.js         <- Route definitions
├── auth.validation.js     <- Joi schemas
└── auth.service.js        <- (optional) tach logic phuc tap ra service
```

### `routes/index.js`
Mount tat ca module routes duoi prefix `/api`.

### `sockets/`
Socket.io event handlers. Truy cap io tu controller: `req.app.get('io')`.

## 4. Response Format

### Success
```json
{
  "success": true,
  "message": "Success",
  "data": { ... }
}
```

### Paginated
```json
{
  "success": true,
  "message": "Success",
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Email is required", "Password too short"]
}
```

## 5. Auth Flow

```
Register -> hash password -> save user -> return tokens
Login -> verify password -> generate access + refresh tokens -> set refresh in cookie
Request -> Bearer token in header -> authenticate middleware -> req.user
Token expired -> client calls /refresh-token -> verify refresh -> new access token
Logout -> clear refresh token
```
