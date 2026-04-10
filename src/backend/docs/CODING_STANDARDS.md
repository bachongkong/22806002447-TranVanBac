# Backend Coding Standards

## 1. Naming Conventions

### Files

| Loai | Convention | Vi du |
|------|-----------|-------|
| Model | PascalCase | `User.js`, `Application.js` |
| Controller | kebab `.controller` | `auth.controller.js` |
| Routes | kebab `.routes` | `auth.routes.js` |
| Validation | kebab `.validation` | `auth.validation.js` |
| Service (optional) | kebab `.service` | `auth.service.js` |
| Middleware | camelCase | `errorHandler.js`, `asyncHandler.js` |
| Utils | camelCase | `jwt.js` |
| Config | camelCase | `env.js`, `database.js` |

### Variables & Functions

```js
// camelCase cho variables & functions
const accessToken = generateAccessToken(payload)
const isEmailVerified = user.isEmailVerified

// UPPER_SNAKE_CASE cho constants
const MAX_LOGIN_ATTEMPTS = 5
const ROLES = { CANDIDATE: 'candidate', HR: 'hr', ADMIN: 'admin' }

// Mongoose model — PascalCase, singular
const User = mongoose.model('User', userSchema)
const Application = mongoose.model('Application', applicationSchema)
```

## 2. Module Structure Pattern

```js
// === [module].validation.js ===
import Joi from 'joi'

export const createJobSchema = {
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    // ...
  }),
}

// === [module].controller.js ===
import { ApiResponse, ApiError } from '../../common/index.js'
import Job from '../../models/Job.js'

const jobController = {
  create: async (req, res) => {
    const job = await Job.create({
      ...req.body,
      createdByHR: req.user.userId,
      companyId: req.user.companyId,
    })
    ApiResponse.created(res, { data: job })
  },

  getById: async (req, res) => {
    const job = await Job.findById(req.params.id).populate('companyId')
    if (!job) throw ApiError.notFound('Job not found')
    ApiResponse.success(res, { data: job })
  },
}
export default jobController

// === [module].routes.js ===
import { Router } from 'express'
import jobController from './job.controller.js'
import { validate, asyncHandler, authenticate, authorize } from '../../middleware/index.js'
import { createJobSchema } from './job.validation.js'
import { ROLES } from '../../common/constants.js'

const router = Router()
router.post('/', authenticate, authorize(ROLES.HR), validate(createJobSchema), asyncHandler(jobController.create))
router.get('/:id', asyncHandler(jobController.getById))

export default router
```

## 3. Error Handling Rules

```js
// [DO] Dung ApiError static methods
throw ApiError.notFound('Job not found')
throw ApiError.badRequest('Invalid status transition')
throw ApiError.forbidden('You can only edit your own company jobs')
throw ApiError.conflict('You already applied for this job')

// [DO] Dung asyncHandler — KHONG can try/catch trong controller
const controller = {
  create: async (req, res) => {
    // asyncHandler se catch tat ca errors
    const job = await Job.create(req.body)
    ApiResponse.created(res, { data: job })
  },
}

// [DONT] KHONG try/catch trong controller (tru khi can handle dac biet)
const bad = {
  create: async (req, res) => {
    try {
      const job = await Job.create(req.body)
      res.json(job) // [DONT] khong dung res.json truc tiep
    } catch (err) {
      res.status(500).json({ error: err.message }) // [DONT] khong format thu cong
    }
  },
}
```

## 4. Validation Rules

```js
// [DO] Luon validate input bang Joi
// [DO] Schema object co key = source (body, query, params)
export const createSchema = {
  body: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    salary: Joi.number().min(0).optional(),
  }),
}

export const listSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    status: Joi.string().valid('published', 'draft').optional(),
  }),
}

// [DO] Route dung: validate(schema)
router.post('/', validate(createSchema), asyncHandler(controller.create))
```

## 5. Response Rules

```js
// [DO] Luon dung ApiResponse
ApiResponse.success(res, { data: job })
ApiResponse.created(res, { data: newUser, message: 'Registered' })
ApiResponse.paginated(res, { data: jobs, page, limit, total })

// [DONT] KHONG dung res.json / res.send truc tiep
res.json({ data: job })          // [DONT]
res.status(201).send(newUser)     // [DONT]
```

## 6. Database Rules

```js
// [DO] Populate khi can, chon fields cu the
const app = await Application.findById(id)
  .populate('candidateId', 'email profile.fullName profile.avatar')
  .populate('jobId', 'title companyId')

// [DO] Lean queries cho read-only (performance)
const jobs = await Job.find({ status: 'published' }).lean()

// [DO] Select fields khi khong can full document
const user = await User.findById(id).select('-passwordHash -refreshToken')

// [DONT] KHONG query toan bo collection khong filter
const all = await Job.find() // [DONT] thieu filter + pagination
```

## 7. Git Commit Convention

```
feat(auth): implement login with JWT
fix(application): prevent duplicate apply
refactor(middleware): extract validation logic
docs(api): update endpoint documentation
```

## 8. Security Rules

```
[DO] Hash password bang bcrypt (cost 12)
[DO] JWT access token ngan han (15m)
[DO] Refresh token luu httpOnly cookie
[DO] Validate tat ca input (Joi)
[DO] Sanitize MongoDB queries (Mongoose da handle)
[DO] Rate limiting cho auth endpoints (team them sau)

[DONT] KHONG log password, token, secrets
[DONT] KHONG hard-code secrets trong code
[DONT] KHONG trust client data — luon validate server-side
[DONT] KHONG expose stack trace o production
```
