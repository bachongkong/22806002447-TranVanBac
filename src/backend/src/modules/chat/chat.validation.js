import Joi from 'joi'

// Custom objectId validation regex
const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'ObjectId')

export const getConversationsSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
  }),
}

export const getMessagesSchema = {
  params: Joi.object({
    id: objectId.required(),
  }),
  query: Joi.object({
    cursor: Joi.date().iso().optional(),
    limit: Joi.number().integer().min(1).max(50).default(20),
  }),
}

export const sendMessageSchema = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    content: Joi.string().trim().required().min(1).max(2000),
  }),
}
