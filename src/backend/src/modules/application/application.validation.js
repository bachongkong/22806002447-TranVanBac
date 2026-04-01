import Joi from 'joi'
import { APPLICATION_STATUS } from '../../common/constants.js'

// Mảng status HR được phép đổi (ngoại trừ SUBMITTED và WITHDRAWN do hệ thống/candidate tự làm)
const ALLOWED_HR_STATUSES = [
  APPLICATION_STATUS.REVIEWING,
  APPLICATION_STATUS.SHORTLISTED,
  APPLICATION_STATUS.INTERVIEW_SCHEDULED,
  APPLICATION_STATUS.INTERVIEWED,
  APPLICATION_STATUS.OFFERED,
  APPLICATION_STATUS.HIRED,
  APPLICATION_STATUS.REJECTED,
]

export const withdrawSchema = {
  params: Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  }),
  body: Joi.object({
    note: Joi.string().trim().max(1000).allow('').optional(),
  }),
}

export const updateStatusSchema = {
  params: Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  }),
  body: Joi.object({
    status: Joi.string()
      .valid(...ALLOWED_HR_STATUSES)
      .required()
      .messages({
        'any.only': `Trạng thái không hợp lệ dành cho HR. Chi tiết: ${ALLOWED_HR_STATUSES.join(', ')}`,
      }),
    note: Joi.string().trim().max(1000).allow('').optional(),
  }),
}
