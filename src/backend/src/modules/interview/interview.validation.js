import Joi from 'joi'
import { INTERVIEW_TYPES, INTERVIEW_RESULTS } from '../../common/constants.js'

export const scheduleSchema = {
  body: Joi.object({
    applicationId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    scheduledAt: Joi.date().iso().required(),
    type: Joi.string()
      .valid(...Object.values(INTERVIEW_TYPES))
      .required(),
    meetingLink: Joi.string().uri().allow('').when('type', {
      is: INTERVIEW_TYPES.ONLINE,
      then: Joi.required().messages({
        'any.required': 'Vui lòng cung cấp link họp trực tuyến (meetingLink)',
      }),
    }),
    location: Joi.string().allow('').when('type', {
      is: INTERVIEW_TYPES.OFFLINE,
      then: Joi.required().messages({
        'any.required': 'Vui lòng cung cấp địa điểm phỏng vấn (location)',
      }),
    }),
    notes: Joi.string().max(2000).allow('').optional(),
    roundNumber: Joi.number().integer().min(1).default(1),
    interviewerIds: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
  }),
}

export const updateSchema = {
  params: Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  }),
  body: Joi.object({
    scheduledAt: Joi.date().iso().optional(),
    type: Joi.string()
      .valid(...Object.values(INTERVIEW_TYPES))
      .optional(),
    meetingLink: Joi.string().uri().allow('').optional(),
    location: Joi.string().allow('').optional(),
    notes: Joi.string().max(2000).allow('').optional(),
    roundNumber: Joi.number().integer().min(1).optional(),
    interviewerIds: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
    result: Joi.string().allow('').optional(),
  }),
}

export const cancelSchema = {
  params: Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  }),
}

export const submitFeedbackSchema = {
  params: Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  }),
  body: Joi.object({
    score: Joi.number().min(0).max(100).required().messages({
      'number.base': 'Thang điểm phải là một số hợp lệ',
      'number.min': 'Điểm không được nhỏ hơn 0',
      'number.max': 'Điểm không vượt quá 100',
    }),
    result: Joi.string()
      .valid(...Object.values(INTERVIEW_RESULTS))
      .required()
      .messages({
        'any.only': `Kết quả phải thuộc một trong: ${Object.values(INTERVIEW_RESULTS).join(', ')}`,
      }),
    notes: Joi.string().max(3000).allow('').optional().messages({
      'string.max': 'Nội dung nhận xét tối đa 3000 ký tự',
    }),
  }),
}
