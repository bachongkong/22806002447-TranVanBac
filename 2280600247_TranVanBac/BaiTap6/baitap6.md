# Bài Tập 6: Frontend React - Hệ Thống Quản Lý Vé Tàu Điện

## Mục Lục

1. [Giới Thiệu](#1-giới-thiệu)
2. [Công Nghệ Sử Dụng](#2-công-nghệ-sử-dụng)
3. [Cấu Trúc Project](#3-cấu-trúc-project)
4. [Chức Năng Đã Hoàn Thành](#4-chức-năng-đã-hoàn-thành)
5. [Chức Năng Chưa Hoàn Thành](#5-chức-năng-chưa-hoàn-thành)
6. [Yêu Cầu Chi Tiết Từng Chức Năng](#6-yêu-cầu-chi-tiết-từng-chức-năng)
7. [Hướng Dẫn Cài Đặt và Chạy](#7-hướng-dẫn-cài-đặt-và-chạy)
8. [API Endpoints](#8-api-endpoints)
9. [Tài Khoản Demo](#9-tài-khoản-demo)

---

## 1. Giới Thiệu

Dự án này xây dựng giao diện frontend sử dụng **React 19** để kết nối với hệ thống quản lý vé tàu điện Metro từ bài tập 4/5. Mục tiêu là tạo một ứng dụng web hoàn chỉnh với đầy đủ tính năng, gần với production nhất.

**Phạm vi bài tập:**
- Xây dựng nền tảng cấu trúc frontend React chuẩn production
- Kết nối với backend có sẵn (BaiTap4/5)
- Triển khai các chức năng cơ bản của hệ thống metro
- Áp dụng các best practices về React 19

---

## 2. Công Nghệ Sử Dụng

### Frontend
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| React | 19.x | UI Framework |
| Vite | 5.x | Build tool, dev server |
| React Router | 7.x | Routing |
| Axios | 1.x | HTTP Client |
| Tailwind CSS | 3.x | Styling |
| Socket.io-client | 4.x | Realtime communication |

### Backend (từ BaiTap5)
| Công nghệ | Mục đích |
|-----------|----------|
| Express.js | Web framework |
| MongoDB + Mongoose | Database |
| Socket.io | Realtime events |
| JWT | Authentication |

---

## 3. Cấu Trúc Project

```
BaiTap6/
├── frontend/                     # React 19 Frontend
│   ├── src/
│   │   ├── components/           # UI Components
│   │   │   ├── Alert.jsx        # ✅ Alert component
│   │   │   ├── Button.jsx       # ✅ Button component
│   │   │   ├── Input.jsx        # ✅ Input component
│   │   │   ├── Layout.jsx       # ✅ Main layout
│   │   │   ├── Notification.jsx # ✅ Notification system
│   │   │   └── ProtectedRoute.jsx # ✅ Route protection
│   │   │
│   │   ├── pages/               # Page Components
│   │   │   ├── Login.jsx        # ✅ Login page
│   │   │   ├── Register.jsx     # ✅ Register page
│   │   │   ├── Dashboard.jsx    # ✅ Dashboard
│   │   │   ├── TicketValidation.jsx # ✅ Ticket validation (staff)
│   │   │   ├── ManualInspection.jsx  # ✅ Manual inspection (inspector)
│   │   │   └── AdminUsers.jsx   # ✅ User management (admin)
│   │   │
│   │   ├── services/            # API Services
│   │   │   ├── api.js          # ✅ Axios instance
│   │   │   ├── auth.service.js # ✅ Auth API
│   │   │   └── metro.service.js # ✅ Metro API
│   │   │
│   │   ├── contexts/           # React Contexts
│   │   │   └── AuthContext.jsx # ✅ Auth context
│   │   │
│   │   ├── hooks/              # Custom Hooks
│   │   │   └── useAuth.js      # ✅ Auth hook
│   │   │
│   │   ├── App.jsx             # ✅ Main app with routing
│   │   ├── main.jsx            # ✅ Entry point
│   │   └── index.css          # ✅ Global styles
│   │
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/                      # Node.js Backend (từ BaiTap5)
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middlewares/
│   │   ├── services/
│   │   ├── events/
│   │   ├── workers/
│   │   ├── validators/
│   │   ├── config/
│   │   └── utils/
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   └── react-lecture.md         # 📚 Bài giảng React 19
│
└── README.md
```

---

## 4. Chức Năng Đã Hoàn Thành

### ✅ Authentication
- [x] Trang đăng nhập (Login)
- [x] Trang đăng ký (Register)
- [x] Quản lý JWT tokens (access token, refresh token)
- [x] Auth Context và useAuth hook
- [x] Protected routes theo role
- [x] Đăng xuất

### ✅ Dashboard
- [x] Hiển thị thông tin user (name, email, role)
- [x] Hiển thị mô tả vai trò
- [x] Hiển thị danh sách chức năng theo role
- [x] Quick actions theo role

### ✅ Role-Based Access Control
- [x] Passenger role
- [x] Staff role
- [x] Inspector role
- [x] Admin role
- [x] Route protection

### ✅ Metro Features - Staff
- [x] Trang validate vé tại cổng (TicketValidation)
- [x] Nhập mã vé và mã trạm
- [x] Hiển thị kết quả validate (ALLOW/DENY/EXPIRED)
- [x] Lịch sử validate gần đây

### ✅ Metro Features - Inspector
- [x] Trang kiểm tra thủ công (ManualInspection)
- [x] Nhập mã vé để kiểm tra
- [x] Xem thông tin chi tiết vé

### ✅ Admin Features
- [x] Trang quản lý người dùng (AdminUsers)
- [x] Danh sách users
- [x] Thay đổi role users

### ✅ UI Components
- [x] Button component
- [x] Input component
- [x] Alert component
- [x] Layout component
- [x] Notification system

### ✅ Project Structure
- [x] Cấu trúc thư mục chuẩn
- [x] Service layer cho API
- [x] React Router v7 routing
- [x] Tailwind CSS styling

---

## 5. Chức Năng Chưa Hoàn Thành

### ❌ Chưa Triển Khai (Cần hoàn thiện)

#### Authentication
- [ ] Quên mật khẩu (forgot password)
- [ ] Đổi mật khẩu (change password)
- [ ] Xác thực hai yếu tố (2FA)
- [ ] Refresh token tự động (auto refresh)
- [ ] Session management chi tiết

#### Metro Features - Passenger (Hành khách)
- [ ] Trang mua vé (Purchase ticket)
- [ ] Danh sách các loại vé
- [ ] Nạp tiền vào tài khoản
- [ ] Lịch sử giao dịch
- [ ] Xem số dư tài khoản

#### Metro Features - Staff (Nhân viên)
- [ ] Danh sách vé đã validate
- [ ] Báo cáo sự cố (report incident)
- [ ] Realtime notifications khi có sự cố

#### Metro Features - Inspector (Kiểm soát viên)
- [ ] Lập biên bản vi phạm (create violation)
- [ ] Danh sách biên bản đã lập
- [ ] Chụp ảnh biên bản
- [ ] Xem lịch sử kiểm tra chi tiết

#### Admin Features
- [ ] Quản lý trạm (Station management)
- [ ] Quản lý tuyến đường (Route management)
- [ ] Quản lý giá vé (Ticket pricing)
- [ ] Thống kê báo cáo (Reports & Analytics)
- [ ] Quản lý cổng soát (Gate management)
- [ ] System settings

#### Realtime Features
- [ ] Socket.io integration đầy đủ
- [ ] Realtime ticket status updates
- [ ] Realtime notifications
- [ ] Live dashboard updates

#### UI/UX
- [ ] Loading states chi tiết
- [ ] Skeleton screens
- [ ] Error boundaries
- [ ] Empty states
- [ ] Responsive design hoàn thiện
- [ ] Dark mode
- [ ] Animations

#### Forms & Validation
- [ ] Form validation chi tiết
- [ ] Form error messages
- [ ] Input masking

#### Additional Features
- [ ] Profile page
- [ ] Settings page
- [ ] Help/FAQ page
- [ ] Multi-language support (i18n)

---

## 6. Yêu Cầu Chi Tiết Từng Chức Năng

### 6.1 Authentication Module

#### Đã hoàn thành ✅
- **Login Page**: Form đăng nhập với email/password
- **Register Page**: Form đăng ký với name/email/password
- **JWT Handling**: Lưu trữ và gửi token trong requests
- **Protected Routes**: Chặn truy cập không được phép

#### Cần hoàn thiện ❌
```
Yêu cầu:
- Forgot Password: Gửi email reset link
- Change Password: Form đổi mật khẩu với old/new password
- 2FA: Tích hợp Google Authenticator hoặc SMS OTP
- Auto Refresh: Tự động refresh token trước khi hết hạn
- Session: Hiển thị session active, cho phép logout từ xa
```

### 6.2 Dashboard Module

#### Đã hoàn thành ✅
- User info card với avatar, name, email, role
- Role description
- Feature list theo role
- Quick actions

#### Cần hoàn thiện ❌
```
Yêu cầu:
- Stats cards: Thống kê nhanh (số vé, số lần validate, etc.)
- Recent activities: Hoạt động gần đây
- Notifications: Thông báo chưa đọc
- Quick stats cho từng role
```

### 6.3 Passenger Module (Hành khách)

#### Chưa triển khai ❌
```
Yêu cầu:

1. Purchase Ticket Page
   - Chọn loại vé (one-way, daily, weekly, monthly)
   - Chọn tuyến đường (origin → destination)
   - Chọn số lượng
   - Tính giá vé tự động
   - Thanh toán (simulated)
   - Xác nhận đơn hàng

2. My Tickets Page
   - Danh sách vé đã mua
   - Trạng thái vé (active, used, expired)
   - Chi tiết vé (mã vé, ngày mua, hạn sử dụng)
   - QR code hiển thị vé

3. Top Up Page
   - Nạp tiền vào tài khoản
   - Chọn số tiền nạp
   - Phương thức thanh toán (simulated)
   - Lịch sử nạp tiền

4. Transaction History
   - Danh sách giao dịch
   - Lọc theo loại giao dịch
   - Lọc theo ngày
   - Chi tiết giao dịch

5. Account Balance
   - Hiển thị số dư
   - Lịch sử thay đổi số dư
```

### 6.4 Staff Module (Nhân viên cổng soát)

#### Đã hoàn thành ✅
- Validate ticket form
- Kết quả validate (ALLOW/DENY/EXPIRED)
- Validation history

#### Cần hoàn thiện ❌
```
Yêu cầu:

1. Validation History Chi Tiết
   - Danh sách tất cả các lần validate
   - Lọc theo ngày, trạm, kết quả
   - Thống kê số lượng validate

2. Report Incident
   - Form báo cáo sự cố
   - Chọn loại sự cố
   - Mô tả chi tiết
   - Gửi báo cáo

3. Gate Status
   - Trạng thái cổng (open/closed)
   - Bật/tắt cổng
   - Realtime status

4. Realtime Features
   - Thông báo khi có vé được mua
   - Thông báo khi có sự cố
   - Live counter
```

### 6.5 Inspector Module (Kiểm soát viên)

#### Đã hoàn thành ✅
- Manual inspection form
- Kiểm tra thông tin vé

#### Cần hoàn thiện ❌
```
Yêu cầu:

1. Create Violation (Lập biên bản)
   - Nhập thông tin hành khách
   - Chọn loại vi phạm
   - Mô tả vi phạm
   - Phạt tiền
   - Chụp ảnh (simulated)
   - Ký tên (simulated)
   - In biên bản (print preview)

2. Violation History
   - Danh sách biên bản đã lập
   - Chi tiết biên bản
   - Cập nhật trạng thái (đã nộp phạt/chưa nộp)

3. Inspection Statistics
   - Số lượng kiểm tra
   - Tỷ lệ vi phạm
   - Thống kê theo thời gian
   - Thống kê theo trạm

4. Quick Check
   - Quét QR nhanh (simulated)
   - Kiểm tra bằng NFC (simulated)
```

### 6.6 Admin Module (Quản trị viên)

#### Đã hoàn thành ✅
- User list
- Change role

#### Cần hoàn thiện ❌
```
Yêu cầu:

1. User Management Chi Tiết
   - Thêm user mới
   - Sửa thông tin user
   - Xóa user
   - Khóa/mở khóa user
   - Reset password

2. Station Management
   - Danh sách trạm
   - Thêm/sửa/xóa trạm
   - Thông tin trạm (tên, địa chỉ, tuyến)

3. Route Management
   - Danh sách tuyến
   - Thêm/sửa/xóa tuyến
   - Cấu hình các trạm trong tuyến
   - Thời gian di chuyển

4. Ticket Pricing
   - Cấu hình giá vé
   - Giá theo tuyến
   - Giá theo loại vé
   - Khuyến mãi

5. Gate Management
   - Danh sách cổng
   - Cấu hình cổng
   - Trạng thái cổng

6. Reports & Analytics
   - Dashboard với charts
   - Doanh thu
   - Số lượng vé bán
   - Số lượng hành khách
   - Vi phạm
   - Export reports (PDF/Excel)

7. System Settings
   - Cấu hình hệ thống
   - Email settings
   - Notification settings
```

### 6.7 Realtime Module

#### Chưa triển khai ❌
```
Yêu cầu:

1. Socket.io Integration
   - Kết nối socket khi login
   - Disconnect khi logout
   - Reconnect khi mất kết nối

2. Realtime Events
   - Ticket purchased → Staff notified
   - Ticket validated → Update status
   - Violation created → Admin notified
   - Gate status changed → Update UI
   - System alerts → Broadcast to all

3. Live Dashboard
   - Live passenger count
   - Live ticket sales
   - Live violations
   - Live gate status
```

### 6.8 UI/UX Improvements

#### Chưa triển khai ❌
```
Yêu cầu:

1. Loading States
   - Spinner cho buttons
   - Skeleton screens cho lists
   - Progress bars cho file uploads

2. Error Handling
   - Error boundaries
   - User-friendly error messages
   - Retry buttons

3. Empty States
   - Empty illustrations
   - Helpful messages
   - Call-to-action buttons

4. Responsive Design
   - Mobile menu
   - Mobile-friendly forms
   - Touch-friendly interactions

5. Animations
   - Page transitions
   - Component animations
   - Loading animations

6. Dark Mode
   - Theme toggle
   - System preference detection
   - Persistent preference
```

---

## 7. Hướng Dẫn Cài Đặt và Chạy

### Yêu cầu hệ thống
- Node.js 18+
- npm hoặc yarn
- MongoDB (cho backend)

### Cài đặt

```bash
# Clone project và di chuyển vào thư mục
cd BaiTap6

# Cài đặt backend
cd backend
npm install

# Cài đặt frontend
cd ../frontend
npm install
```

### Cấu hình môi trường

```bash
# Backend - copy .env.example và cấu hình
cd backend
cp .env.example .env
# Chỉnh sửa .env với MongoDB connection string

# Frontend - copy .env.example
cd ../frontend
cp .env.example .env
```

### Chạy ứng dụng

```bash
# Terminal 1: Backend
cd backend
npm run dev
# Backend chạy tại: http://localhost:3000

# Terminal 2: Frontend
cd frontend
npm run dev
# Frontend chạy tại: http://localhost:5173
```

---

## 8. API Endpoints

### Authentication
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Đăng ký | ✅ |
| POST | `/api/auth/login` | Đăng nhập | ✅ |
| POST | `/api/auth/refresh-token` | Refresh token | ✅ |
| POST | `/api/auth/logout` | Đăng xuất | ✅ |

### Users
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/users/me` | Get current user | ✅ |
| GET | `/api/users` | Get all users (admin) | ✅ |
| PATCH | `/api/users/:id/role` | Update user role | ✅ |

### Metro
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/metro/tickets/:code/validate-entry` | Validate ticket | ✅ |
| POST | `/api/metro/tickets/:code/manual-inspection` | Manual inspection | ✅ |

---

## 9. Tài Khoản Demo

### Khi sử dụng với MongoDB

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@metro.com | admin123 |
| Staff | staff@metro.com | staff123 |
| Inspector | inspector@metro.com | inspector123 |
| Passenger | passenger@metro.com | passenger123 |

---

## Tổng Kết

### Hoàn thành
- ✅ Cấu trúc project chuẩn React 19
- ✅ Authentication cơ bản
- ✅ Role-based routing
- ✅ Dashboard theo role
- ✅ Ticket validation (staff)
- ✅ Manual inspection (inspector)
- ✅ User management (admin)
- ✅ UI Components

### Cần phát triển thêm
- ❌ Passenger features (mua vé, lịch sử, etc.)
- ❌ Advanced staff features (báo cáo, realtime)
- ❌ Inspector features (lập biên bản, thống kê)
- ❌ Admin features (quản lý trạm, tuyến, báo cáo)
- ❌ Realtime features
- ❌ UI/UX improvements

---

*Bài tập 6 - Xây dựng giao diện React 19 cho hệ thống quản lý vé tàu điện Metro*
