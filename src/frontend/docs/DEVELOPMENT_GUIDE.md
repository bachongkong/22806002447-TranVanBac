# Development Guide

## 1. Setup ban đầu

```bash
cd src/frontend
npm install
npm run dev       # chạy trên http://localhost:3000
```

## 2. Thêm 1 Page mới (step-by-step)

Ví dụ: thêm trang **"Đơn ứng tuyển"** cho Candidate.

### Bước 1 — Tạo page component

```
src/pages/candidate/MyApplicationsPage.jsx
```

```jsx
import { useDocumentTitle } from '@shared/hooks'

export default function MyApplicationsPage() {
  useDocumentTitle('Đơn ứng tuyển')

  return (
    <div className="page">
      <h1>Đơn ứng tuyển của tôi</h1>
      {/* Nội dung ở đây */}
    </div>
  )
}
```

### Bước 2 — Đăng ký route

Mở `src/app/router/AppRouter.jsx`:

```jsx
// Thêm import
import MyApplicationsPage from '@pages/candidate/MyApplicationsPage'

// Thêm route vào nhóm CANDIDATE ROUTES
<Route path="/candidate/my-applications" element={<MyApplicationsPage />} />
```

### Bước 3 — Thêm vào sidebar (nếu cần)

Mở `src/layouts/CandidateLayout.jsx`, thêm vào mảng `candidateMenu`:

```js
{ to: '/candidate/my-applications', icon: HiOutlineDocumentText, label: 'Đơn ứng tuyển' },
```

**Xong!** Page đã hoạt động.

---

## 3. Thêm 1 Feature component

Ví dụ: tạo **JobCard** component cho feature `jobs`.

### Bước 1 — Tạo component + CSS

```
src/features/jobs/components/JobCard.jsx
src/features/jobs/components/JobCard.css
```

```jsx
// JobCard.jsx
import { formatSalary, timeAgo } from '@shared/utils'
import './JobCard.css'

export default function JobCard({ job, onSave, onApply }) {
  return (
    <div className="job-card">
      <h3 className="job-card__title">{job.title}</h3>
      <p className="job-card__company">{job.companyName}</p>
      <span className="job-card__salary">
        {formatSalary(job.salaryRange?.min, job.salaryRange?.max)}
      </span>
      <span className="job-card__time">{timeAgo(job.createdAt)}</span>
      <div className="job-card__actions">
        <button className="btn btn--outline" onClick={() => onSave(job._id)}>Lưu</button>
        <button className="btn btn--primary" onClick={() => onApply(job._id)}>Apply</button>
      </div>
    </div>
  )
}
```

### Bước 2 — Export từ feature

Mở `src/features/jobs/index.js`:

```js
export { default as jobService } from './services/jobService'
export { default as JobCard } from './components/JobCard'
```

### Bước 3 — Dùng trong page

```jsx
import { JobCard } from '@features/jobs'
```

---

## 4. Thêm 1 API hook (TanStack Query)

Ví dụ: tạo hook `useJobs` để fetch danh sách jobs.

### Tạo file

```
src/features/jobs/hooks/useJobs.js
```

```jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import jobService from '../services/jobService'

// --- Query: lấy danh sách jobs ---
export function useJobs(params) {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => jobService.search(params).then(res => res.data),
  })
}

// --- Query: lấy job detail ---
export function useJob(id) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => jobService.getById(id).then(res => res.data),
    enabled: !!id,
  })
}

// --- Mutation: tạo job ---
export function useCreateJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => jobService.create(data),
    onSuccess: () => {
      toast.success('Tạo tin tuyển dụng thành công!')
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    },
  })
}

// --- Mutation: toggle favorite ---
export function useToggleFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (jobId) => jobService.toggleFavorite(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['favorite-jobs'] })
    },
  })
}
```

### Dùng trong page

```jsx
import { useJobs, useToggleFavorite } from '@features/jobs/hooks/useJobs'

export default function JobListPage() {
  const { data, isLoading, error } = useJobs({ page: 1, limit: 10 })
  const toggleFavorite = useToggleFavorite()

  if (isLoading) return <LoadingSpinner />
  if (error) return <div>Lỗi: {error.message}</div>

  return (
    <div>
      {data.jobs.map(job => (
        <JobCard
          key={job._id}
          job={job}
          onSave={() => toggleFavorite.mutate(job._id)}
        />
      ))}
    </div>
  )
}
```

---

## 5. Thêm 1 Form (React Hook Form + Zod)

Ví dụ: form đăng nhập.

```jsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Schema validation
const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
})

export default function LoginForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register('email')} />
        {errors.email && <span className="form-error">{errors.email.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Mật khẩu</label>
        <input id="password" type="password" {...register('password')} />
        {errors.password && <span className="form-error">{errors.password.message}</span>}
      </div>

      <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
        {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
      </button>
    </form>
  )
}
```

---

## 6. Sử dụng Auth Store

```jsx
import useAuthStore from '@app/store/authStore'

function SomeComponent() {
  // Đọc state
  const { user, isAuthenticated } = useAuthStore()

  // Dùng helper
  const isHR = useAuthStore(state => state.isHR())

  // Actions
  const { setCredentials, logout } = useAuthStore()

  const handleLogin = async (formData) => {
    const { data } = await authService.login(formData)
    setCredentials({
      user: data.user,
      accessToken: data.accessToken,
    })
  }
}
```

---

## 7. Checklist trước khi commit

- [ ] `npm run build` không lỗi
- [ ] `npm run lint` không warning
- [ ] Component có CSS riêng (nếu cần style)
- [ ] Dùng CSS variables, không hardcode colors
- [ ] Import đúng thứ tự (xem CODING_STANDARDS.md)
- [ ] File đặt đúng folder theo kiến trúc
- [ ] Tên file/biến/function đúng convention
- [ ] Không để `console.log` trong code commited
