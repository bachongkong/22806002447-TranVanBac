import Joi from 'joi'

export const registerSchema = {
  body: Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .lowercase()
      .trim()
      .required()
      .messages({
        'string.email': 'Email không hợp lệ',
        'any.required': 'Email là bắt buộc',
      }),

    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.min': 'Mật khẩu tối thiểu 8 ký tự',
        'string.max': 'Mật khẩu tối đa 128 ký tự',
        'string.pattern.base': 'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số',
        'any.required': 'Mật khẩu là bắt buộc',
      }),

    fullName: Joi.string()
      .min(2)
      .max(100)
      .trim()
      .required()
      .messages({
        'string.min': 'Họ tên tối thiểu 2 ký tự',
        'string.max': 'Họ tên tối đa 100 ký tự',
        'any.required': 'Họ tên là bắt buộc',
      }),

    role: Joi.string()
      .valid('candidate', 'hr')
      .default('candidate')
      .messages({
        'any.only': 'Role chỉ được là candidate hoặc hr',
      }),
  }),
}

export const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}

export const forgotPasswordSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
}

export const resetPasswordSchema = {
  body: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(6).max(128).required(),
  }),
}
