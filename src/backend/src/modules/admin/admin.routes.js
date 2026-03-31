import { Router } from 'express'
import { asyncHandler, authenticate, authorize } from '../../middleware/index.js'
import { ApiResponse } from '../../common/index.js'
import { ROLES } from '../../common/constants.js'

const router = Router()
router.use(authenticate)
router.use(authorize(ROLES.ADMIN))

// Users
router.get('/users', asyncHandler(async (req, res) => {
  ApiResponse.success(res, { message: 'Admin list users — chưa implement' })
}))

router.patch('/users/:id/toggle-block', asyncHandler(async (req, res) => {
  ApiResponse.success(res, { message: 'Toggle block — chưa implement' })
}))

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

export default router
