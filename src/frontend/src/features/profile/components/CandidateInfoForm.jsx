import { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// Simplified for UI layout purposes (Handling comma-separated skills in text input)
const candidateInfoSchema = z.object({
  skills: z.string().optional().or(z.literal('')),
  expectedSalary: z.number().min(0, 'Lương mong muốn không hợp lệ').optional().or(z.literal('')),
  preferredLocation: z.string().optional().or(z.literal('')),
  portfolioLinks: z.string().optional().or(z.literal('')),
})

function CandidateInfoForm({ initialData, onSubmit, isPending }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(candidateInfoSchema),
    defaultValues: {
      skills: initialData?.skills?.join(', ') || '',
      expectedSalary: initialData?.expectedSalary || '',
      preferredLocation: initialData?.preferredLocation || '',
      portfolioLinks: initialData?.portfolioLinks?.join(', ') || '',
    },
  })

  const submitHandler = useCallback(
    (data) => {
      // transform comma separated strings back to arrays
      const formattedData = {
        ...data,
        skills: data.skills ? data.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        portfolioLinks: data.portfolioLinks ? data.portfolioLinks.split(',').map((s) => s.trim()).filter(Boolean) : [],
        // Parse float if available
        expectedSalary: data.expectedSalary ? parseFloat(data.expectedSalary) : undefined,
      }
      onSubmit(formattedData)
    },
    [onSubmit]
  )

  return (
    <div className="profile-section">
      <h3 className="section-title">Thông tin Ứng viên</h3>
      <form onSubmit={handleSubmit(submitHandler)} className="profile-form">
        <div className="form-group">
          <label htmlFor="skills">Kỹ năng (cách nhau bởi dấu phẩy)</label>
          <input
            id="skills"
            type="text"
            className={`form-input ${errors.skills ? 'error' : ''}`}
            placeholder="vd: React, Node.js, Python"
            {...register('skills')}
          />
          {errors.skills && <span className="error-message">{errors.skills.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="expectedSalary">Lương mong muốn (VNĐ/Tháng)</label>
          <input
            id="expectedSalary"
            type="number"
            className={`form-input ${errors.expectedSalary ? 'error' : ''}`}
            placeholder="vd: 15000000"
            {...register('expectedSalary', { valueAsNumber: true })}
          />
          {errors.expectedSalary && <span className="error-message">{errors.expectedSalary.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="preferredLocation">Địa điểm làm việc mong muốn</label>
          <input
            id="preferredLocation"
            type="text"
            className={`form-input ${errors.preferredLocation ? 'error' : ''}`}
            placeholder="vd: Hồ Chí Minh, Remote"
            {...register('preferredLocation')}
          />
          {errors.preferredLocation && <span className="error-message">{errors.preferredLocation.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="portfolioLinks">Liên kết Portfolio (cách nhau bởi dấu phẩy)</label>
          <input
            id="portfolioLinks"
            type="text"
            className={`form-input ${errors.portfolioLinks ? 'error' : ''}`}
            placeholder="vd: https://github.com/abc, https://behance.net/xyz"
            {...register('portfolioLinks')}
          />
          {errors.portfolioLinks && <span className="error-message">{errors.portfolioLinks.message}</span>}
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={!isDirty || isPending}
          >
            {isPending ? 'Đang lưu...' : 'Lưu thông tin ứng viên'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default memo(CandidateInfoForm)
