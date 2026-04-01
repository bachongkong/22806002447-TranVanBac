import Joi from 'joi'

export const applyJobSchema = {
  headers: Joi.object({
    'x-idempotency-key': Joi.string().required().messages({
      'any.required': 'Vui lòng cung cấp x-idempotency-key trên header',
    }),
  }).unknown(true), // Cho phép các header khác pass qua
  body: Joi.object({
    jobId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    cvId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    coverLetter: Joi.string().trim().max(5000).allow('').optional(),
  }),
}
