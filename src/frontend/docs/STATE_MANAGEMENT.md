# State Management Guide

## Nguyên tắc chọn state

```
Câu hỏi: "Data này từ đâu?"
│
├── Từ API server?
│   |   -> TanStack Query (useQuery / useMutation)
│
├── State toàn app, cần persist?
│   |   -> Zustand store (authStore)
│
├── State toàn app, không cần persist?
│   |   -> Zustand store (uiStore)
│
├── State dùng trong 1 component?
│   └── useState
│
├── State dùng giữa parent-child gần?
│   └── Props drilling (truyền qua props)
│
└── State phức tạp trong 1 component (form, wizard)?
    └── useReducer
```

## 1. TanStack Query — Server State

**Dùng cho**: data từ API (jobs, applications, users, notifications...)

```jsx
// [DO] Dung — data tu server dung useQuery
const { data: jobs } = useQuery({
  queryKey: ['jobs'],
  queryFn: () => jobService.getAll().then(r => r.data),
})

// [DONT] Sai — KHONG luu API data vao useState
const [jobs, setJobs] = useState([])
useEffect(() => {
  jobService.getAll().then(r => setJobs(r.data))
}, [])
```

### Tại sao TanStack Query thay vì useState + useEffect?

- Tự động cache & dedup requests
- Tự động refetch khi quay lại tab
- Loading / error states có sẵn
- Optimistic updates
- Pagination / infinite scroll built-in

## 2. Zustand — Client State

### authStore (có persist)

```js
// Đọc
const user = useAuthStore(state => state.user)
const isAuthenticated = useAuthStore(state => state.isAuthenticated)

// Check role
const isHR = useAuthStore(state => state.isHR())

// Actions
const { setCredentials, logout, updateUser } = useAuthStore()
```

### uiStore (không persist)

```js
// Sidebar
const { sidebarOpen, toggleSidebar } = useUIStore()

// Modal
const { openModal, closeModal, activeModal, modalData } = useUIStore()
openModal('DELETE_JOB', { jobId: '123' })

// Loading
const { setGlobalLoading } = useUIStore()
```

### Thêm store mới (khi nào?)

Chỉ tạo store mới khi:
- State dùng ở **nhiều nơi không liên quan nhau** (không phải parent-child)
- State **không phải** từ API

Ví dụ có thể tạo thêm: `notificationStore` (unread count cho badge).

### Pattern tạo store

```js
import { create } from 'zustand'

const useExampleStore = create((set, get) => ({
  // State
  items: [],
  selectedId: null,

  // Actions
  setItems: (items) => set({ items }),
  selectItem: (id) => set({ selectedId: id }),
  clearSelection: () => set({ selectedId: null }),

  // Computed (dùng get)
  getSelectedItem: () => {
    const { items, selectedId } = get()
    return items.find(i => i._id === selectedId) || null
  },
}))

export default useExampleStore
```

## 3. useState — Component Local State

```jsx
// [DO] Dung cho UI state trong 1 component
const [isOpen, setIsOpen] = useState(false)
const [searchTerm, setSearchTerm] = useState('')
const [selectedTab, setSelectedTab] = useState('all')
```

## 4. Anti-patterns — TRÁNH

```jsx
// [DONT] Luu API data vao Zustand store
// (dùng TanStack Query thay thế)
const useJobStore = create((set) => ({
  jobs: [],
  fetchJobs: async () => {
    const res = await jobService.getAll()
    set({ jobs: res.data })
  },
}))

// [DONT] Prop drilling qua 3 level
// → Dùng Zustand store hoặc React Context

// [DONT] Dung useEffect de sync state giua cac component
// → Dùng shared store hoặc lift state up
```
