import { Router } from 'express'
import companyController from './company.controller.js'
import {
  asyncHandler,
  authenticate,
  authorize,
  validate,
  upload,
} from '../../middleware/index.js'
import { ROLES } from '../../common/constants.js'
import {
  createCompanySchema,
  updateCompanySchema,
  companyIdParamSchema,
  listCompaniesSchema,
  addHrMemberSchema,
  removeHrMemberSchema,
} from './company.validation.js'

const router = Router()

// ============================================
// Public Routes
// ============================================

router.get(
  '/',
  validate(listCompaniesSchema),
  asyncHandler(companyController.listCompanies)
)

// ============================================
// Authenticated Routes (HR only)
// ============================================

// ⚠️ /my-company phải đặt TRƯỚC /:id để Express không parse "my-company" thành :id param
router.get(
  '/my-company',
  authenticate,
  authorize(ROLES.HR),
  asyncHandler(companyController.getMyCompany)
)

// ── Public: lấy company theo ID ──
router.get(
  '/:id',
  validate(companyIdParamSchema),
  asyncHandler(companyController.getCompanyById)
)

// ── Authenticated: CRUD ──
router.post(
  '/',
  authenticate,
  authorize(ROLES.HR),
  validate(createCompanySchema),
  asyncHandler(companyController.createCompany)
)

router.put(
  '/:id',
  authenticate,
  authorize(ROLES.HR),
  validate(updateCompanySchema),
  asyncHandler(companyController.updateCompany)
)

router.patch(
  '/:id/logo',
  authenticate,
  authorize(ROLES.HR),
  validate(companyIdParamSchema),
  upload.single('logo'),
  asyncHandler(companyController.uploadLogo)
)

// ── HR Member Management ──
router.get(
  '/:id/members',
  authenticate,
  authorize(ROLES.HR),
  validate(companyIdParamSchema),
  asyncHandler(companyController.listHrMembers)
)

router.post(
  '/:id/members',
  authenticate,
  authorize(ROLES.HR),
  validate(addHrMemberSchema),
  asyncHandler(companyController.addHrMember)
)

router.delete(
  '/:id/members/:memberId',
  authenticate,
  authorize(ROLES.HR),
  validate(removeHrMemberSchema),
  asyncHandler(companyController.removeHrMember)
)

export default router
