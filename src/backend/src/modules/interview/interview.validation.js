import Joi from 'joi'
import { INTERVIEW_RESULTS } from '../../common/constants.js'

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
