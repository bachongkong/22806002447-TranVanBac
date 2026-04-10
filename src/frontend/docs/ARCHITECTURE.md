# Kien truc Frontend — Smart Recruitment Platform

## 1. Tổng quan

Frontend theo mô hình **Feature-Based Architecture** — tổ chức code theo nghiệp vụ (auth, jobs, applications...) thay vì theo loại file (components, pages, services...).

```
src/
├── app/           ← Cấu hình app-level (router, store, providers)
├── features/      ← Modules nghiệp vụ (mỗi feature = 1 folder tự chứa)
├── shared/        ← Code dùng chung giữa các features
├── layouts/       ← Layout shells (MainLayout, CandidateLayout, HRLayout, AdminLayout)
├── pages/         ← Page components (kết nối layout + feature components)
├── assets/        ← Static files (images, fonts)
├── App.jsx        ← Root component
├── main.jsx       ← Entry point
└── index.css      ← Global styles + design tokens
```

## 2. Luồng dữ liệu (Data Flow)

```
User Action
  → Page component
    → Feature hook (useMutation / useQuery)
      → Feature service (apiClient.get/post/...)
        → Backend API

Response
  → apiClient interceptor (auto refresh token nếu 401)
    → TanStack Query cache
      → Component re-render
```

## 3. Nguyên tắc phân chia folder

### `app/` — Application Shell
Chỉ chứa config app-level. **KHÔNG chứa UI component hay business logic.**

| File | Mục đích |
|------|----------|
| `providers/AppProvider.jsx` | Wrap QueryClient, Router, Toast |
| `router/AppRouter.jsx` | Toàn bộ route config |
| `store/authStore.js` | Auth state global (JWT, user, role) |
| `store/uiStore.js` | UI state global (sidebar, modal) |

### `features/` — Business Modules
Mỗi feature là **1 module tự chứa** với cấu trúc riêng:

```
features/
└── jobs/
    ├── components/    ← UI components riêng cho feature này
    │   ├── JobCard.jsx
    │   ├── JobCard.css
    │   └── JobFilter.jsx
    ├── hooks/         ← Custom hooks (useJobs, useCreateJob...)
    │   └── useJobs.js
    ├── services/      ← API calls
    │   └── jobService.js
    ├── utils/         ← Helper riêng cho feature (nếu cần)
    └── index.js       ← Barrel export
```

> **Quy tac quan trong**: Feature A **KHONG duoc** import truc tiep tu ben trong Feature B.
> Nếu cần dùng chung → chuyển vào `shared/`.

### `shared/` — Code dùng chung

```
shared/
├── components/    ← UI components dùng chung (Button, Modal, Badge...)
├── hooks/         ← Custom hooks chung (useDebounce, useClickOutside...)
├── services/      ← apiClient, apiEndpoints
├── constants/     ← Enums, config values
└── utils/         ← Helper functions chung
```

### `layouts/` — Page Shells
Layout chỉ chứa **khung trang** (header, sidebar, footer) + `<Outlet />`.
**KHÔNG chứa business logic.**

### `pages/` — Page Components
Pages nằm tại `pages/` và chia theo role:

```
pages/
├── HomePage.jsx                ← public
├── LoginPage.jsx               ← public
├── candidate/
│   ├── CandidateDashboard.jsx
│   ├── MyApplicationsPage.jsx
│   └── MyProfilePage.jsx
├── hr/
│   ├── HRDashboard.jsx
│   └── ManageJobsPage.jsx
└── admin/
    ├── AdminDashboard.jsx
    └── ManageUsersPage.jsx
```

## 4. Alias paths

Đã cấu hình trong `vite.config.js`:

| Alias | Trỏ đến |
|-------|---------|
| `@/` | `src/` |
| `@app` | `src/app/` |
| `@features` | `src/features/` |
| `@shared` | `src/shared/` |
| `@layouts` | `src/layouts/` |
| `@pages` | `src/pages/` |
| `@assets` | `src/assets/` |

```js
// [DO] Dung
import { useAuthStore } from '@app/store'
import { LoadingSpinner } from '@shared/components'

// [DONT] Sai — tranh relative path dai
import { LoadingSpinner } from '../../../shared/components'
```

## 5. Routing & RBAC

Routes chia thành 4 nhóm trong `AppRouter.jsx`:

| Nhóm | Layout | Guard |
|------|--------|-------|
| Public | `MainLayout` | Không cần auth |
| Candidate | `CandidateLayout` | `ProtectedRoute` + role=candidate |
| HR | `HRLayout` | `ProtectedRoute` + role=hr |
| Admin | `AdminLayout` | `ProtectedRoute` + role=admin |

Khi thêm route mới, thêm `<Route>` vào đúng nhóm trong `AppRouter.jsx`.
