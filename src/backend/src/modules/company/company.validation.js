import Joi from 'joi'

// ============================================
// Company Validation Schemas
// ============================================

export const createCompanySchema = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(200).required().messages({
      'string.min': 'Tên công ty tối thiểu 2 ký tự',
      'string.max': 'Tên công ty tối đa 200 ký tự',
      'any.required': 'Tên công ty là bắt buộc',
    }),
    description: Joi.string().trim().max(2000).allow('').messages({
      'string.max': 'Mô tả tối đa 2000 ký tự',
    }),
    website: Joi.string().trim().uri().allow('').messages({
      'string.uri': 'Website không hợp lệ',
    }),
    industry: Joi.string().trim().max(100).allow('').messages({
      'string.max': 'Ngành nghề tối đa 100 ký tự',
    }),
    companySize: Joi.string()
      .trim()
      .valid('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+', '')
      .allow('')
      .messages({
        'any.only': 'Quy mô công ty không hợp lệ',
      }),
    location: Joi.string().trim().max(200).allow('').messages({
      'string.max': 'Địa chỉ tối đa 200 ký tự',
    }),
    socialLinks: Joi.object({
      linkedin: Joi.string().trim().uri().allow(''),
      facebook: Joi.string().trim().uri().allow(''),
    }),
  }),
}

export const updateCompanySchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'ID không hợp lệ',
        'any.required': 'ID là bắt buộc',
      }),
  }),
  body: Joi.object({
    name: Joi.string().trim().min(2).max(200).messages({
      'string.min': 'Tên công ty tối thiểu 2 ký tự',
      'string.max': 'Tên công ty tối đa 200 ký tự',
    }),
    description: Joi.string().trim().max(2000).allow(''),
    website: Joi.string().trim().uri().allow(''),
    industry: Joi.string().trim().max(100).allow(''),
    companySize: Joi.string()
      .trim()
      .valid('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+', '')
      .allow(''),
    location: Joi.string().trim().max(200).allow(''),
    socialLinks: Joi.object({
      linkedin: Joi.string().trim().uri().allow(''),
      facebook: Joi.string().trim().uri().allow(''),
    }),
  }).min(1).messages({
    'object.min': 'Cần ít nhất 1 field để cập nhật',
  }),
}

export const companyIdParamSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'ID không hợp lệ',
        'any.required': 'ID là bắt buộc',
      }),
  }),
}

export const listCompaniesSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    search: Joi.string().trim().max(100).allow(''),
    industry: Joi.string().trim().max(100).allow(''),
  }),
}

// ============================================
// HR Member Schemas
// ============================================

export const addHrMemberSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'ID không hợp lệ',
        'any.required': 'ID là bắt buộc',
      }),
  }),
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
  }),
}

export const removeHrMemberSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Company ID không hợp lệ',
        'any.required': 'Company ID là bắt buộc',
      }),
    memberId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Member ID không hợp lệ',
        'any.required': 'Member ID là bắt buộc',
      }),
  }),
}
