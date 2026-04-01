import Joi from 'joi'
import { JOB_STATUS } from '../../common/constants.js'

// ============================================
// Job Validation Schemas
// ============================================

/**
 * POST /jobs — HR tạo job mới
 */
export const createJobSchema = {
  body: Joi.object({
    title: Joi.string().trim().min(3).max(200).required(),
    description: Joi.string().trim().min(10).required(),
    requirements: Joi.string().trim().allow('').optional(),
    benefits: Joi.string().trim().allow('').optional(),
    salaryRange: Joi.object({
      min: Joi.number().min(0).optional(),
      max: Joi.number().min(0).optional(),
    }).optional(),
    location: Joi.string().trim().max(200).allow('').optional(),
    employmentType: Joi.string().trim().max(50).allow('').optional(),
    experienceLevel: Joi.string().trim().max(50).allow('').optional(),
    skills: Joi.array().items(Joi.string().trim()).max(20).optional(),
    expiresAt: Joi.date().greater('now').optional(),
  }),
}

/**
 * PUT /jobs/:id — HR cập nhật job (chỉ khi status = draft)
 */
export const updateJobSchema = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
  body: Joi.object({
    title: Joi.string().trim().min(3).max(200).optional(),
    description: Joi.string().trim().min(10).optional(),
    requirements: Joi.string().trim().allow('').optional(),
    benefits: Joi.string().trim().allow('').optional(),
    salaryRange: Joi.object({
      min: Joi.number().min(0).optional(),
      max: Joi.number().min(0).optional(),
    }).optional(),
    location: Joi.string().trim().max(200).allow('').optional(),
    employmentType: Joi.string().trim().max(50).allow('').optional(),
    experienceLevel: Joi.string().trim().max(50).allow('').optional(),
    skills: Joi.array().items(Joi.string().trim()).max(20).optional(),
    expiresAt: Joi.date().greater('now').optional(),
  }).min(1), // ít nhất 1 field để update
}

/**
 * PATCH /jobs/:id/status — HR chuyển trạng thái
 */
export const updateStatusSchema = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
  body: Joi.object({
    status: Joi.string()
      .valid(JOB_STATUS.PENDING, JOB_STATUS.PUBLISHED, JOB_STATUS.DRAFT, JOB_STATUS.CLOSED)
      .required()
      .messages({
        'any.only': 'HR chỉ có thể chuyển trạng thái sang pending, published, draft, hoặc closed',
      }),
  }),
}

/**
 * GET /jobs/:id — Lấy chi tiết job
 */
export const getJobByIdSchema = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
}

/**
 * GET /jobs/my-jobs — HR liệt kê jobs của mình
 */
export const listMyJobsSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    status: Joi.string()
      .valid(...Object.values(JOB_STATUS))
      .optional(),
    sort: Joi.string().valid('createdAt', '-createdAt', 'title', '-title').default('-createdAt'),
  }),
}
