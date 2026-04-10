# Bài Tập 6: Frontend React - Hệ Thống Quản Lý Vé Tàu Điện

## Giới Thiệu

Dự án này xây dựng giao diện frontend sử dụng **React 19** để kết nối với hệ thống quản lý vé tàu điện (đã có từ BaiTap4/5).

## Cấu Trúc Thư Mục

```
BaiTap6/
├── frontend/                 # React 19 Frontend
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── pages/          # Page Components
│   │   ├── services/      # API Services
│   │   ├── contexts/      # React Contexts
│   │   ├── hooks/         # Custom Hooks
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── backend/                 # Node.js Backend (từ BaiTap5)
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   └── ...
│   ├── package.json
│   └── ...
│
└── README.md
```

## Công Nghệ Sử Dụng

### Frontend
- **React 19** với Vite
- **React Router v7** cho routing
- **Axios** cho HTTP requests
- **Tailwind CSS** cho styling
- **Socket.io-client** cho realtime

### Backend
- **Express.js** + **MongoDB** (từ BaiTap5)
- **Socket.io** cho realtime events

## Cài Đặt

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
# Cần MongoDB local đang chạy
npm run dev
```

## Tài Khoản Demo

Khi sử dụng với MongoDB:
- **Admin**: admin@metro.com / admin123
- **Staff**: staff@metro.com / staff123
- **Inspector**: inspector@metro.com / inspector123
- **Passenger**: passenger@metro.com / passenger123

## Chức Năng

### Authentication
- Đăng nhập / Đăng ký / Đăng xuất
- JWT token management
- Role-based access control

### Dashboard
- Hiển thị thông tin user
- Menu điều hướng theo role

### Metro Features
- **Staff**: Validate vé tại cổng
- **Inspector**: Kiểm tra thủ công
- **Admin**: Quản lý users

### Realtime
- Socket.io integration cho realtime events

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh-token`
- `POST /api/auth/logout`

### Users
- `GET /api/users/me`
- `GET /api/users`
- `PATCH /api/users/:id/role`

### Metro
- `POST /api/metro/tickets/:code/validate-entry`
- `POST /api/metro/tickets/:code/manual-inspection`

## Development

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Frontend chạy tại: http://localhost:5173
Backend chạy tại: http://localhost:3000
