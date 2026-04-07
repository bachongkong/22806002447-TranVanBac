import Joi from 'joi'

// ============================================
// Notification Validation Schemas
// ============================================

/**
 * GET /notifications — Danh sách notifications (có pagination & filter)
 */
export const listNotificationsSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20),
    isRead: Joi.boolean().optional(),
  }),
}

/**
 * PATCH /notifications/:id/read — Đánh dấu đã đọc 1 notification
 */
export const markReadSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({ 'string.pattern.base': 'Invalid notification ID' }),
  }),
}
