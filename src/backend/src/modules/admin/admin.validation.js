import Joi from 'joi'
import { ROLES, USER_STATUS } from '../../common/constants.js'

export const getUsersSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
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
    })
  })
}
