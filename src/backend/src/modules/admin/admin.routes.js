import { Router } from 'express'
import { asyncHandler, authenticate, authorize, validate } from '../../middleware/index.js'
import { ROLES } from '../../common/constants.js'
import { ApiResponse } from '../../common/index.js'
import adminController from './admin.controller.js'
import {
  getUsersSchema,
  toggleBlockUserSchema,
  moderateJobSchema,
  moderateCompanySchema,
  listPendingCompaniesSchema,
  getAuditLogsSchema,
  exportUsersSchema
} from './admin.validation.js'
import multer from 'multer'

const upload = multer({ storage: multer.memoryStorage() })

const router = Router()
router.use(authenticate)
router.use(authorize(ROLES.ADMIN))

// ============================================
// User Moderation
// ============================================
router.get('/users', validate(getUsersSchema), asyncHandler(adminController.getUsers))
router.get('/users/export', validate(exportUsersSchema), asyncHandler(adminController.exportUsers))
router.patch('/users/:id/toggle-block', validate(toggleBlockUserSchema), asyncHandler(adminController.toggleBlockUser))

// ============================================
// Company Moderation
// ============================================
router.get('/companies/pending', validate(listPendingCompaniesSchema), asyncHandler(adminController.getPendingCompanies))
router.patch('/companies/:id/approve', validate(moderateCompanySchema), asyncHandler(adminController.approveCompany))
router.patch('/companies/:id/reject', validate(moderateCompanySchema), asyncHandler(adminController.rejectCompany))
router.patch('/companies/:id/lock', validate(moderateCompanySchema), asyncHandler(adminController.lockCompany))

// ============================================
// Job Moderation
// ============================================
router.get('/jobs/pending', asyncHandler(adminController.getJobsPending))
router.patch('/jobs/:id/approve', validate(moderateJobSchema), asyncHandler(adminController.approveJob))
router.patch('/jobs/:id/reject', validate(moderateJobSchema), asyncHandler(adminController.rejectJob))

// ============================================
// System Audit Logs
// ============================================
router.get('/audit-logs', validate(getAuditLogsSchema), asyncHandler(adminController.getAuditLogs))

// ============================================
// Import Master Data CSV (Stream)
// ============================================
router.post('/master-data/import', upload.single('file'), asyncHandler(adminController.importMasterData))

// ============================================
// Dashboard
// ============================================
router.get('/dashboard', asyncHandler(adminController.getDashboardStats))

export default router
