import { z } from 'zod'

const educationSchema = z.object({
  school: z.string().min(1, 'Tên trường không được để trống'),
  degree: z.string().min(1, 'Bằng cấp không được để trống'),
  field: z.string().min(1, 'Lĩnh vực/kỳ học không được để trống'),
  from: z.string().min(1, 'Năm bắt đầu bắt buộc'),
  to: z.string().optional(),
})

const experienceSchema = z.object({
  company: z.string().min(1, 'Tên công ty bắt buộc'),
  position: z.string().min(1, 'Vị trí bắt buộc'),
  from: z.string().min(1, 'Thời gian bắt đầu bắt buộc'),
  to: z.string().optional(),
  description: z.string().optional(),
})

const projectSchema = z.object({
  name: z.string().min(1, 'Tên dự án bắt buộc'),
  description: z.string().optional(),
  url: z.string().optional(),
})

export const cvSchema = z.object({
  title: z.string().min(1, 'Tên CV (dùng để gợi nhớ) không được để trống'),
  parsedData: z.object({
    summary: z.string().optional(),
    skills: z.array(z.string()).default([]),
    education: z.array(educationSchema).default([]),
    experience: z.array(experienceSchema).default([]),
    projects: z.array(projectSchema).default([]),
  }),
})
