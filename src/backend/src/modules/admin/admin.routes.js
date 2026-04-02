import { Router } from 'express'
import { asyncHandler, authenticate, authorize, validate } from '../../middleware/index.js'
import { ApiResponse } from '../../common/index.js'
import { ROLES } from '../../common/constants.js'
import adminController from './admin.controller.js'
import { getUsersSchema, toggleBlockUserSchema } from './admin.validation.js'
import multer from 'multer'

const upload = multer({ storage: multer.memoryStorage() })

const router = Router()
router.use(authenticate)
router.use(authorize(ROLES.ADMIN))

// Users
router.get('/users', validate(getUsersSchema), asyncHandler(adminController.getUsers))

router.patch('/users/:id/toggle-block', validate(toggleBlockUserSchema), asyncHandler(adminController.toggleBlockUser))

// Companies moderation
router.get('/companies/pending', asyncHandler(async (req, res) => {
  ApiResponse.success(res, { message: 'Pending companies — chưa implement' })
}))

router.patch('/companies/:id/approve', asyncHandler(async (req, res) => {
  ApiResponse.success(res, { message: 'Approve company — chưa implement' })
}))

router.patch('/companies/:id/reject', asyncHandler(async (req, res) => {
  ApiResponse.success(res, { message: 'Reject company — chưa implement' })
}))

// Jobs moderation
router.get('/jobs/pending', asyncHandler(async (req, res) => {
  ApiResponse.success(res, { message: 'Pending jobs — chưa implement' })
}))

router.patch('/jobs/:id/approve', asyncHandler(async (req, res) => {
  ApiResponse.success(res, { message: 'Approve job — chưa implement' })
}))

router.patch('/jobs/:id/reject', asyncHandler(async (req, res) => {
  ApiResponse.success(res, { message: 'Reject job — chưa implement' })
}))

// Dashboard
router.get('/dashboard', asyncHandler(async (req, res) => {
  ApiResponse.success(res, { message: 'Admin dashboard — chưa implement' })
}))

// Master Data Import
router.post('/master-data/import', upload.single('file'), asyncHandler(adminController.importMasterData))

export default router
