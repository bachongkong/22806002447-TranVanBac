# Feature Checklist

Khi xay dung 1 feature moi, di theo checklist nay.

## Feature: `[ten feature]`

### 1. Tao cau truc folder

```
src/features/[feature-name]/
├── components/
│   ├── ComponentA.jsx
│   └── ComponentA.css
├── hooks/
│   └── use[Feature].js
├── services/
│   └── [feature]Service.js
└── index.js              <- barrel export
```

### 2. Service layer
- [ ] Tao `[feature]Service.js` voi cac methods can thiet
- [ ] Them endpoints vao `shared/services/apiEndpoints.js` (neu chua co)
- [ ] Export qua `index.js`

### 3. Hooks layer
- [ ] Tao hooks dung `useQuery` cho GET requests
- [ ] Tao hooks dung `useMutation` cho POST/PUT/DELETE
- [ ] Xu ly loading, error, success (toast)
- [ ] Invalidate dung query keys sau mutation

### 4. Components layer
- [ ] Tao UI components (Card, List, Form, Detail...)
- [ ] Moi component co file CSS rieng
- [ ] Dung CSS variables tu design system
- [ ] Props co naming ro rang, callback bat dau bang `on`

### 5. Pages layer
- [ ] Tao page trong `src/pages/[role]/`
- [ ] Dung `useDocumentTitle` hook
- [ ] Handle 3 states: loading, error, empty
- [ ] Responsive (mobile-first)

### 6. Routing
- [ ] Them route vao `AppRouter.jsx` dung nhom role
- [ ] Them menu item vao sidebar layout (neu can)

### 7. Review
- [ ] `npm run build` pass
- [ ] `npm run lint` clean
- [ ] Khong console.log
- [ ] Dung naming convention
- [ ] Dung folder/file structure

---

## Trang thai cac features hien tai

| Feature | Service | Hooks | Components | Pages | Routes | Status |
|---------|---------|-------|------------|-------|--------|--------|
| auth | Done | -- | -- | placeholder | -- | scaffold |
| jobs | Done | -- | -- | placeholder | -- | scaffold |
| companies | Done | -- | -- | -- | -- | scaffold |
| applications | Done | -- | -- | -- | -- | scaffold |
| cvs | Done | -- | -- | -- | -- | scaffold |
| interviews | Done | -- | -- | -- | -- | scaffold |
| notifications | Done | -- | -- | -- | -- | scaffold |
| chat | Done | -- | -- | -- | -- | scaffold |
| admin | Done | -- | -- | placeholder | -- | scaffold |
| candidate | -- | -- | -- | placeholder | -- | scaffold |
| hr | -- | -- | -- | placeholder | -- | scaffold |

### Legend
- Done = Hoan thanh
- -- = Chua bat dau
- scaffold = Chi co folder + stubs
