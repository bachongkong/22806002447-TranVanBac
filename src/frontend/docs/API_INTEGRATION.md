# API Integration Guide

## 1. apiClient — Cách hoạt động

File: `src/shared/services/apiClient.js`

apiClient là instance Axios đã cấu hình sẵn:

- **Base URL**: lấy từ `VITE_API_URL` env hoặc mặc định `/api`
- **Request interceptor**: tự động gắn `Authorization: Bearer <token>` từ authStore
- **Response interceptor**: tự động refresh token khi nhận 401, nếu refresh fail → logout

> **KHONG tao Axios instance moi.** Luon import `apiClient` tu `@shared/services`.

## 2. apiEndpoints — Danh sách endpoints

File: `src/shared/services/apiEndpoints.js`

Tất cả API paths được define tập trung tại đây. Khi backend thêm/sửa endpoint, chỉ cần sửa 1 file.

```js
import { API } from '@shared/services'

API.AUTH.LOGIN           // → '/auth/login'
API.JOBS.BY_ID('abc123') // → '/jobs/abc123'
API.APPLICATIONS.BY_JOB('xyz') // → '/jobs/xyz/applications'
```

## 3. Tạo Service mới

Mỗi feature có 1 file service. Pattern:

```js
// src/features/[module]/services/[module]Service.js
import { apiClient, API } from '@shared/services'

const exampleService = {
  getAll: (params) => apiClient.get(API.EXAMPLE.BASE, { params }),
  getById: (id) => apiClient.get(API.EXAMPLE.BY_ID(id)),
  create: (data) => apiClient.post(API.EXAMPLE.BASE, data),
  update: (id, data) => apiClient.put(API.EXAMPLE.BY_ID(id), data),
  delete: (id) => apiClient.delete(API.EXAMPLE.BY_ID(id)),
}

export default exampleService
```

### Rules cho service

```
[DO] Moi function return Promise (tu apiClient)
[DO] Khong xu ly response o day — de hook/component handle
[DO] Upload file dung Content-Type multipart/form-data
[DO] Cac params query string truyen qua { params }

[DONT] KHONG try/catch trong service
[DONT] KHONG goi toast/alert o day
[DONT] KHONG truy cap store o day (tru apiClient interceptor)
```

## 4. Dùng TanStack Query

### Query (GET data)

```jsx
import { useQuery } from '@tanstack/react-query'
import { jobService } from '@features/jobs'

function useJobs(filters) {
  return useQuery({
    // queryKey PHẢI unique và chứa đủ dependencies
    queryKey: ['jobs', filters],

    // queryFn trả về data
    queryFn: () => jobService.search(filters).then(res => res.data),

    // Options
    staleTime: 5 * 60 * 1000,  // 5 phút cache
    enabled: !!filters,         // chỉ fetch khi có filters
  })
}
```

### Mutation (POST/PUT/DELETE)

```jsx
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

function useApplyJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => applicationService.apply(data),

    onSuccess: () => {
      toast.success('Ứng tuyển thành công!')
      // Invalidate cache để refetch
      queryClient.invalidateQueries({ queryKey: ['my-applications'] })
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    },
  })
}
```

### Query Key Convention

```js
// List
queryKey: ['jobs']
queryKey: ['jobs', { page: 1, status: 'published' }]

// Detail
queryKey: ['job', jobId]

// Nested
queryKey: ['job', jobId, 'applications']

// Scoped by user
queryKey: ['my-applications']
queryKey: ['my-cvs']
```

## 5. Error handling

apiClient interceptor xử lý 401 tự động. Các error khác, handle trong hook:

```jsx
// Trong component
const { data, isLoading, error } = useJobs()

if (isLoading) return <LoadingSpinner />

if (error) {
  return <ErrorMessage message={error.response?.data?.message || 'Lỗi tải dữ liệu'} />
}
```

## 6. File upload

```jsx
const handleUploadCV = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('title', file.name)

  // cvService đã config Content-Type multipart
  await cvService.upload(formData)
}
```

## 7. Environment Variables

Tạo file `.env` tại `src/frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

> Tất cả env vars cho Vite phải bắt đầu bằng `VITE_`.
> Truy cập qua `import.meta.env.VITE_API_URL`.
