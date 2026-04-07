import Joi from 'joi'
import { ROLES, USER_STATUS, JOB_STATUS } from '../../common/constants.js'

// ============================================
// BE-ADM-01: User Moderation
// ============================================

export const getUsersSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    role: Joi.string().valid(...Object.values(ROLES)).optional(),
    status: Joi.string().valid(...Object.values(USER_STATUS)).optional(),
    keyword: Joi.string().trim().min(2).max(100).optional(),
    sort: Joi.string().valid('createdAt', '-createdAt', 'email', '-email').default('-createdAt'),
  }),
}

export const exportUsersSchema = {
  query: Joi.object({
    role: Joi.string().valid(...Object.values(ROLES)).optional(),
    status: Joi.string().valid(...Object.values(USER_STATUS)).optional(),
    keyword: Joi.string().trim().min(2).max(100).optional(),
    sort: Joi.string().valid('createdAt', '-createdAt', 'email', '-email').default('-createdAt')
  })
}

export const toggleBlockUserSchema = {
  params: Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
      'string.pattern.base': 'User ID must be a valid MongoDB ObjectId',
    }),
  }),
  body: Joi.object({
    reason: Joi.string().trim().max(500).optional(),
  }),
}

// ============================================
// BE-ADM-01: Job Moderation
// ============================================

export const moderateJobSchema = {
  params: Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
      'string.pattern.base': 'Job ID must be a valid MongoDB ObjectId',
    }),
  }),
  body: Joi.object({
    reason: Joi.string().trim().max(500).optional(),
  }),
}

// ============================================
// BE-ADM-02: Audit Logs
// ============================================

export const getAuditLogsSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    action: Joi.string().trim().max(100).optional(),
    userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional().messages({
      'string.pattern.base': 'User ID must be a valid MongoDB ObjectId',
    }),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
    sort: Joi.string().valid('createdAt', '-createdAt').default('-createdAt'),
  }),
}

// ============================================
// Company Moderation
// ============================================

export const moderateCompanySchema = {
  params: Joi.object({
    id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Company ID không hợp lệ',
        'any.required': 'Company ID là bắt buộc',
      }),
  }),
}

export const listPendingCompaniesSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
  }),
}
