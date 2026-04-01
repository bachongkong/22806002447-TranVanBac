import Joi from 'joi'

export const searchJobSchema = {
  query: Joi.object({
    keyword: Joi.string().trim().min(2).max(100).optional(),
    location: Joi.string().trim().max(100).optional(),
    employmentType: Joi.string().trim().max(50).optional(),
    experienceLevel: Joi.string().trim().max(50).optional(),
    salaryMin: Joi.number().min(0).optional(),
    cursor: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional().messages({
      'string.pattern.base': 'Cursor must be a valid MongoDB ObjectId',
    }),
    limit: Joi.number().integer().min(1).max(50).default(10),
  }),
}
