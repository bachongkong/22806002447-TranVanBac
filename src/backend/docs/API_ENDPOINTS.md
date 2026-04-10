# API Endpoints Reference

## Base URL: `/api`

## Auth

| Method | Endpoint | Auth | Role | Mo ta |
|--------|----------|------|------|-------|
| POST | `/auth/register` | No | - | Dang ky |
| POST | `/auth/login` | No | - | Dang nhap |
| POST | `/auth/logout` | No | - | Dang xuat |
| POST | `/auth/refresh-token` | No | - | Refresh access token |
| POST | `/auth/forgot-password` | No | - | Quen mat khau |
| POST | `/auth/reset-password` | No | - | Reset mat khau |
| GET | `/auth/verify-email` | No | - | Xac thuc email |
| GET | `/auth/me` | Yes | Any | Lay thong tin user hien tai |

## Users

| Method | Endpoint | Auth | Role | Mo ta |
|--------|----------|------|------|-------|
| GET | `/users/profile` | Yes | Any | Lay profile |
| PUT | `/users/profile` | Yes | Any | Cap nhat profile |
| PUT | `/users/change-password` | Yes | Any | Doi mat khau |

## Companies

| Method | Endpoint | Auth | Role | Mo ta |
|--------|----------|------|------|-------|
| GET | `/companies` | No | - | Danh sach companies public |
| GET | `/companies/:id` | No | - | Chi tiet company public |
| POST | `/companies` | Yes | HR | Tao company |
| PUT | `/companies/:id` | Yes | HR | Cap nhat company |
| PATCH | `/companies/:id/logo` | Yes | HR | Upload hoac doi logo company |
| GET | `/companies/my-company` | Yes | HR | Lay company cua HR hien tai |
| GET | `/companies/:id/members` | Yes | HR | Lay danh sach HR members cua company |
| POST | `/companies/:id/members` | Yes | HR | Them HR member vao company |
| DELETE | `/companies/:id/members/:memberId` | Yes | HR | Xoa HR member khoi company |

## Jobs

| Method | Endpoint | Auth | Role | Mo ta |
|--------|----------|------|------|-------|
| GET | `/jobs` | No | - | Danh sach jobs published |
| GET | `/jobs/search` | No | - | Search va filter jobs |
| GET | `/jobs/:id` | No | - | Chi tiet job |
| GET | `/jobs/favorites` | Yes | Candidate | Danh sach job da luu |
| POST | `/jobs/:id/favorite` | Yes | Candidate | Toggle luu job |
| POST | `/jobs` | Yes | HR | Tao job |
| PUT | `/jobs/:id` | Yes | HR | Cap nhat job |

## Applications

| Method | Endpoint | Auth | Role | Mo ta |
|--------|----------|------|------|-------|
| POST | `/applications` | Yes | Candidate | Apply job |
| GET | `/applications/my-applications` | Yes | Candidate | Don cua toi |
| PATCH | `/applications/:id/withdraw` | Yes | Candidate | Rut don |
| GET | `/applications/:id` | Yes | HR/Candidate | Chi tiet application |
| PATCH | `/applications/:id/status` | Yes | HR | Doi trang thai |
| GET | `/applications/by-job/:jobId` | Yes | HR | Danh sach ung vien theo job |

## CVs

| Method | Endpoint | Auth | Role | Mo ta |
|--------|----------|------|------|-------|
| GET | `/cvs` | Yes | Candidate | Danh sach CV |
| POST | `/cvs/upload` | Yes | Candidate | Upload CV file |
| POST | `/cvs` | Yes | Candidate | Tao CV builder |
| PUT | `/cvs/:id` | Yes | Candidate | Cap nhat CV |
| DELETE | `/cvs/:id` | Yes | Candidate | Xoa CV |
| PATCH | `/cvs/:id/default` | Yes | Candidate | Dat CV mac dinh |
| POST | `/cvs/:id/parse` | Yes | Candidate | OCR parse CV |

## Interviews

| Method | Endpoint | Auth | Role | Mo ta |
|--------|----------|------|------|-------|
| POST | `/interviews` | Yes | HR | Tao lich phong van |
| PUT | `/interviews/:id` | Yes | HR | Cap nhat lich |
| GET | `/interviews/:id` | Yes | Any | Chi tiet interview |

## Notifications

| Method | Endpoint | Auth | Role | Mo ta |
|--------|----------|------|------|-------|
| GET | `/notifications` | Yes | Any | Danh sach notifications |
| PATCH | `/notifications/:id/read` | Yes | Any | Danh dau da doc |
| PATCH | `/notifications/read-all` | Yes | Any | Danh dau tat ca da doc |
| GET | `/notifications/unread-count` | Yes | Any | So chua doc |

## Chat

| Method | Endpoint | Auth | Role | Mo ta |
|--------|----------|------|------|-------|
| GET | `/chat/conversations` | Yes | Any | Danh sach conversations |
| GET | `/chat/conversations/:id/messages` | Yes | Any | Lay messages |
| POST | `/chat/conversations/:id/messages` | Yes | Any | Gui message |

## Admin

| Method | Endpoint | Auth | Role | Mo ta |
|--------|----------|------|------|-------|
| GET | `/admin/users` | Yes | Admin | Danh sach users |
| PATCH | `/admin/users/:id/toggle-block` | Yes | Admin | Khoa mo user |
| GET | `/admin/companies/pending` | Yes | Admin | Companies cho duyet |
| PATCH | `/admin/companies/:id/approve` | Yes | Admin | Duyet company |
| PATCH | `/admin/companies/:id/reject` | Yes | Admin | Tu choi company |
| PATCH | `/admin/companies/:id/lock` | Yes | Admin | Khoa company |
| GET | `/admin/jobs/pending` | Yes | Admin | Jobs cho duyet |
| PATCH | `/admin/jobs/:id/approve` | Yes | Admin | Duyet job |
| PATCH | `/admin/jobs/:id/reject` | Yes | Admin | Tu choi job |
| GET | `/admin/audit-logs` | Yes | Admin | Danh sach audit logs |
| POST | `/admin/master-data/import` | Yes | Admin | Import master data CSV |
| GET | `/admin/dashboard` | Yes | Admin | Dashboard stats |

## Health

| Method | Endpoint | Auth | Mo ta |
|--------|----------|------|-------|
| GET | `/health` | No | Health check |
