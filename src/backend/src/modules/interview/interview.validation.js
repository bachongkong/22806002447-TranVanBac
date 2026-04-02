import Joi from 'joi'
import { INTERVIEW_TYPES } from '../../common/constants.js'

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
