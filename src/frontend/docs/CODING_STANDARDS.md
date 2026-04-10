# Coding Standards

## 1. Naming Conventions

### Files & Folders

| Loại | Convention | Ví dụ |
|------|-----------|-------|
| React Component | PascalCase | `JobCard.jsx`, `LoadingSpinner.jsx` |
| CSS cho component | Cùng tên | `JobCard.css` |
| Hook | camelCase, bắt đầu `use` | `useJobs.js`, `useDebounce.js` |
| Service | camelCase + `Service` | `jobService.js`, `authService.js` |
| Store (Zustand) | camelCase + `Store` | `authStore.js`, `uiStore.js` |
| Util / Helper | camelCase | `formatDate.js` |
| Constants | camelCase (file) | `index.js` |
| Feature folder | kebab-case hoặc camelCase | `jobs/`, `notifications/` |
| Page folder | kebab-case theo role | `candidate/`, `hr/`, `admin/` |

### Variables & Functions

```js
// Variables — camelCase
const jobList = []
const isLoading = true
const currentUser = null

// Constants — UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 5 * 1024 * 1024
const API_TIMEOUT = 15000

// Enums / Maps — UPPER_SNAKE_CASE keys
const JOB_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
}

// Functions — camelCase, verb-first
function getJobById(id) {}
function handleSubmit() {}
function formatSalary(min, max) {}

// Boolean — is/has/can/should prefix
const isAuthenticated = true
const hasPermission = false
const canApply = true

// Event handlers — handle + Event
function handleClick() {}
function handleFormSubmit() {}
function handleStatusChange() {}
```

### React Components

```jsx
// Component — PascalCase
function JobCard({ job, onApply }) { ... }

// Props — camelCase
<JobCard
  job={jobData}
  isLoading={false}
  onApply={handleApply}     // callback props bắt đầu bằng 'on'
/>
```

## 2. Component Rules

### Cấu trúc 1 component file

```jsx
// 1. Imports (thứ tự: react → third-party → alias → relative → CSS)
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { LoadingSpinner } from '@shared/components'
import { formatDate } from '@shared/utils'
import './JobCard.css'

// 2. Component
export default function JobCard({ job, onApply }) {
  // 2a. Hooks
  const [isExpanded, setIsExpanded] = useState(false)

  // 2b. Derived values
  const isExpired = new Date(job.expiresAt) < new Date()

  // 2c. Handlers
  const handleApply = () => {
    if (!isExpired) onApply(job._id)
  }

  // 2d. Early returns
  if (!job) return null

  // 2e. Render
  return (
    <div className="job-card">
      ...
    </div>
  )
}
```

### Quy tắc component

```
[DO] 1 file = 1 component (export default)
[DO] Moi component di kem CSS rieng (neu can style)
[DO] Props destructuring o parameter
[DO] Dung early return cho loading/error/empty states
[DO] Component < 200 dong -> neu dai hon, tach con

[DONT] KHONG dung inline styles (tru dynamic values)
[DONT] KHONG logic nang trong JSX -> tach ra bien/ham
[DONT] KHONG dung index lam key trong list
```

## 3. CSS Rules

### BEM-like naming (giản lược)

```css
/* Block */
.job-card { }

/* Element */
.job-card__title { }
.job-card__meta { }
.job-card__actions { }

/* Modifier */
.job-card--featured { }
.job-card--closed { }
```

### Quy tắc CSS

```
[DO] Moi component co file .css rieng
[DO] Dung CSS variables tu index.css cho colors, spacing, radius
[DO] Dung class names, KHONG dung tag selectors (div, span...)
[DO] Mobile-first responsive (min-width media queries)

[DONT] KHONG dung !important (tru override third-party)
[DONT] KHONG dat class generic qua (vi du: .title, .card, .container)
[DONT] KHONG dung ID selectors cho styling
```

### Sử dụng design tokens

```css
/* [DO] Dung CSS variables */
.job-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
}

/* [DONT] Hardcode colors */
.job-card {
  background: #111128;
  border: 1px solid rgba(255, 255, 255, 0.06);
}
```

## 4. Import Rules

### Thứ tự import (mỗi nhóm cách 1 dòng trống)

```js
// 1. React
import { useState, useEffect } from 'react'

// 2. Third-party libraries
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

// 3. App-level
import useAuthStore from '@app/store/authStore'

// 4. Shared
import { LoadingSpinner } from '@shared/components'
import { ROLES } from '@shared/constants'
import { formatDate } from '@shared/utils'

// 5. Feature (cùng feature hoặc khác)
import { jobService } from '@features/jobs'

// 6. Relative imports (components con, CSS)
import JobCard from './components/JobCard'
import './JobListPage.css'
```

## 5. Git Commit Convention

```
feat: thêm tính năng mới
fix: sửa bug
refactor: refactor code (không thay đổi logic)
style: thay đổi style/CSS
docs: thêm/sửa docs
chore: cấu hình, dependencies
```

Ví dụ:
```
feat(jobs): thêm trang JobListPage với search filter
fix(auth): sửa lỗi refresh token loop
refactor(applications): tách ApplicationCard thành component riêng
style(layouts): responsive sidebar cho mobile
```
