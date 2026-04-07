import { z } from 'zod';

export const jobSchema = z.object({
  title: z
    .string()
    .min(5, 'Tiêu đề công việc phải có ít nhất 5 ký tự.')
    .max(100, 'Tiêu đề không được vượt quá 100 ký tự.'),
  description: z
    .string()
    .min(20, 'Vui lòng mô tả chi tiết công việc (ít nhất 20 ký tự).'),
  requirements: z
    .string()
    .min(20, 'Vui lòng nhập yêu cầu ứng viên (ít nhất 20 ký tự).'),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'freelance', 'internship']),
  location: z.string().min(2, 'Vui lòng nhập địa điểm làm việc/tỉnh thành.'),
  salaryRange: z
    .object({
      min: z.number({ invalid_type_error: 'Lương phải là số.' }).min(0, 'Mức lương không hợp lệ.').nullable().optional(),
      max: z.number({ invalid_type_error: 'Lương phải là số.' }).min(0, 'Mức lương không hợp lệ.').nullable().optional(),
    })
    .optional()
    .refine(
      (data) => {
        // Only validate max >= min if BOTH are provided via numerical value
        if (data && typeof data.min === 'number' && typeof data.max === 'number') {
          return data.max >= data.min;
        }
        return true;
      },
      {
        message: 'Lương tối đa phải lớn hơn hoặc bằng lương tối thiểu.',
        path: ['max'],
      }
    ),
});
