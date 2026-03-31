# Backend Development Guide

## 1. Setup

```bash
cd src/backend
npm install
cp .env.example .env    # sua MONGODB_URI neu can
npm run dev             # chay tren http://localhost:5000
```

Test health check:
```bash
curl http://localhost:5000/api/health
```

## 2. Them Module moi (step-by-step)

Vi du: them module **Report**.

### Buoc 1 — Tao Model (neu can)

```js
// src/models/Report.js
import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  // ...
}, { timestamps: true })

export default mongoose.model('Report', reportSchema)
```

Them export vao `src/models/index.js`.

### Buoc 2 — Tao Validation

```
src/modules/report/report.validation.js
```

```js
import Joi from 'joi'

export const createReportSchema = {
  body: Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
  }),
}
```

### Buoc 3 — Tao Controller

```
src/modules/report/report.controller.js
```

```js
import { ApiResponse, ApiError } from '../../common/index.js'
import Report from '../../models/Report.js'

const reportController = {
  create: async (req, res) => {
    const report = await Report.create(req.body)
    ApiResponse.created(res, { data: report })
  },

  getAll: async (req, res) => {
    const { page = 1, limit = 10 } = req.query
    const skip = (page - 1) * limit

    const [reports, total] = await Promise.all([
      Report.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      Report.countDocuments(),
    ])

    ApiResponse.paginated(res, { data: reports, page, limit, total })
  },
}

export default reportController
```

### Buoc 4 — Tao Routes

```
src/modules/report/report.routes.js
```

```js
import { Router } from 'express'
import reportController from './report.controller.js'
import { asyncHandler, authenticate, authorize, validate } from '../../middleware/index.js'
import { createReportSchema } from './report.validation.js'
import { ROLES } from '../../common/constants.js'

const router = Router()
router.use(authenticate)

router.post('/', authorize(ROLES.ADMIN), validate(createReportSchema), asyncHandler(reportController.create))
router.get('/', authorize(ROLES.ADMIN), asyncHandler(reportController.getAll))

export default router
```

### Buoc 5 — Mount vao Central Router

Mo `src/routes/index.js`:

```js
import reportRoutes from '../modules/report/report.routes.js'
router.use('/reports', reportRoutes)
```

**Xong!** API endpoint `/api/reports` da hoat dong.

---

## 3. Pagination Pattern

```js
const getAll = async (req, res) => {
  const { page = 1, limit = 10, sort = '-createdAt', ...filters } = req.query
  const skip = (page - 1) * limit

  // Build query
  const query = {}
  if (filters.status) query.status = filters.status
  if (filters.search) {
    query.$text = { $search: filters.search }
  }

  const [data, total] = await Promise.all([
    Model.find(query).skip(skip).limit(Number(limit)).sort(sort).lean(),
    Model.countDocuments(query),
  ])

  ApiResponse.paginated(res, { data, page, limit, total })
}
```

## 4. Auth-Protected Endpoints

```js
import { authenticate, authorize } from '../../middleware/index.js'
import { ROLES } from '../../common/constants.js'

// Chi can dang nhap
router.get('/profile', authenticate, asyncHandler(controller.getProfile))

// Chi HR
router.post('/jobs', authenticate, authorize(ROLES.HR), asyncHandler(controller.createJob))

// HR hoac Admin
router.get('/applications', authenticate, authorize(ROLES.HR, ROLES.ADMIN), asyncHandler(controller.getApps))

// Chi Admin
router.delete('/users/:id', authenticate, authorize(ROLES.ADMIN), asyncHandler(controller.deleteUser))
```

## 5. Emit Socket Event tu Controller

```js
const updateStatus = async (req, res) => {
  const application = await Application.findByIdAndUpdate(...)

  // Emit realtime notification
  const io = req.app.get('io')
  io.to(`user:${application.candidateId}`).emit('notification', {
    type: 'status_changed',
    message: 'Trang thai ung tuyen da thay doi',
    data: application,
  })

  ApiResponse.success(res, { data: application })
}
```

## 6. Tach Service Layer (optional)

Khi controller qua dai (>100 dong logic), tach ra service:

```
modules/auth/
├── auth.controller.js   <- nhan req/res, goi service, tra response
├── auth.service.js      <- business logic thuan (khong biet req/res)
├── auth.routes.js
└── auth.validation.js
```

```js
// auth.service.js
import User from '../../models/User.js'
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt.js'
import { ApiError } from '../../common/index.js'

const authService = {
  register: async ({ email, password, fullName, role }) => {
    const exists = await User.findOne({ email })
    if (exists) throw ApiError.conflict('Email already registered')

    const user = await User.create({
      email,
      passwordHash: password,
      role,
      profile: { fullName },
    })

    const accessToken = generateAccessToken({ userId: user._id, role: user.role })
    return { user, accessToken }
  },
}

export default authService

// auth.controller.js
import authService from './auth.service.js'
import { ApiResponse } from '../../common/index.js'

const authController = {
  register: async (req, res) => {
    const result = await authService.register(req.body)
    ApiResponse.created(res, { data: result })
  },
}
```

## 7. Checklist truoc khi commit

- [ ] `npm run dev` start khong loi
- [ ] Endpoint tra dung format (ApiResponse)
- [ ] Input da validate bang Joi
- [ ] Routes co dung middleware (auth, authorize)
- [ ] Khong de `console.log` debug trong code
- [ ] Khong hardcode secrets
- [ ] Error handling dung ApiError, khong dung res.status() truc tiep
