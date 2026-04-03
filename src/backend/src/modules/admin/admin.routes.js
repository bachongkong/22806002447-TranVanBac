import { Router } from 'express'
import { asyncHandler, authenticate, authorize, validate } from '../../middleware/index.js'
import { ROLES } from '../../common/constants.js'
import adminController from './admin.controller.js'
import {
  getUsersSchema,
  toggleBlockUserSchema,
  moderateJobSchema,
  getAuditLogsSchema,
} from './admin.validation.js'
import multer from 'multer'

const upload = multer({ storage: multer.memoryStorage() })
  moderateCompanySchema,
  listPendingCompaniesSchema,
} from './admin.validation.js'
import { getUsersSchema, toggleBlockUserSchema, getAuditLogsSchema } from './admin.validation.js'

const router = Router()
router.use(authenticate)
router.use(authorize(ROLES.ADMIN))

// ============================================
// BE-ADM-01: User Moderation
// ============================================
router.get('/users', validate(getUsersSchema), asyncHandler(adminController.getUsers))
router.patch('/users/:id/toggle-block', validate(toggleBlockUserSchema), asyncHandler(adminController.toggleBlockUser))

// ============================================
// BE-ADM-01: Job Moderation (Ban / Approve)
// ============================================
router.get('/jobs/pending', asyncHandler(adminController.getJobsPending))
router.patch('/jobs/:id/approve', validate(moderateJobSchema), asyncHandler(adminController.approveJob))
router.patch('/jobs/:id/reject', validate(moderateJobSchema), asyncHandler(adminController.rejectJob))

// ============================================
// BE-ADM-02: System Audit Logs
// ============================================
router.get('/audit-logs', validate(getAuditLogsSchema), asyncHandler(adminController.getAuditLogs))

// ============================================
// BE-ADM-03: Import Master Data CSV (Stream)
// ============================================
router.post('/master-data/import', upload.single('file'), asyncHandler(adminController.importMasterData))
// Companies moderation
router.get('/companies/pending', validate(listPendingCompaniesSchema), asyncHandler(adminController.getPendingCompanies))

router.patch('/companies/:id/approve', validate(moderateCompanySchema), asyncHandler(adminController.approveCompany))

router.patch('/companies/:id/reject', validate(moderateCompanySchema), asyncHandler(adminController.rejectCompany))

router.patch('/companies/:id/lock', validate(moderateCompanySchema), asyncHandler(adminController.lockCompany))

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

// System Audit Logs
router.get('/audit-logs', validate(getAuditLogsSchema), asyncHandler(adminController.getAuditLogs))

export default router
