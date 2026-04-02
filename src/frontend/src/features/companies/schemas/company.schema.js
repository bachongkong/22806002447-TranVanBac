import { z } from 'zod'

export const companyProfileSchema = z.object({
  name: z.string()
    .min(2, 'Tên công ty phải có ít nhất 2 ký tự')
    .max(200, 'Tên công ty tối đa 200 ký tự'),
  description: z.string()
    .max(2000, 'Mô tả tối đa 2000 ký tự')
    .optional()
    .nullable(),
  website: z.string()
    .url('Website không hợp lệ (ví dụ: https://example.com)')
    .optional()
    .nullable()
    .or(z.literal('')),
  industry: z.string()
    .max(100, 'Ngành nghề tối đa 100 ký tự')
    .optional()
    .nullable(),
  companySize: z.string()
    .optional()
    .nullable(),
  location: z.string()
    .max(200, 'Địa chỉ tối đa 200 ký tự')
    .optional()
    .nullable(),
  socialLinks: z.object({
    linkedin: z.string()
      .url('LinkedIn URL không hợp lệ')
      .optional()
      .nullable()
      .or(z.literal('')),
    facebook: z.string()
      .url('Facebook URL không hợp lệ')
      .optional()
      .nullable()
      .or(z.literal('')),
  }).optional(),
})

export const hrMemberSchema = z.object({
  email: z.string()
    .email('Email không hợp lệ')
    .min(1, 'Email không được để trống'),
})
