import { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const splitCommaSeparated = (value = '') =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const hasOnlyValidPortfolioLinks = (value) =>
  value === '' || splitCommaSeparated(value).every((link) => z.string().url().safeParse(link).success)

const candidateInfoSchema = z.object({
  skills: z.string().optional().or(z.literal('')),
  expectedSalary: z.number().min(0, 'Luong mong muon khong hop le').optional(),
  preferredLocation: z.string().optional().or(z.literal('')),
  portfolioLinks: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(hasOnlyValidPortfolioLinks, 'Moi lien ket portfolio phai la URL hop le'),
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
      expectedSalary: initialData?.expectedSalary ?? undefined,
      preferredLocation: initialData?.preferredLocation || '',
      portfolioLinks: initialData?.portfolioLinks?.join(', ') || '',
    },
  })

  const submitHandler = useCallback(
    (data) => {
      onSubmit({
        ...data,
        skills: splitCommaSeparated(data.skills),
        portfolioLinks: splitCommaSeparated(data.portfolioLinks),
        expectedSalary: data.expectedSalary ?? undefined,
      })
    },
    [onSubmit]
  )

  return (
    <div className="profile-section">
      <h3 className="section-title">Thong tin ung vien</h3>
      <form onSubmit={handleSubmit(submitHandler)} className="profile-form">
        <div className="form-group">
          <label htmlFor="skills">Ky nang (cach nhau boi dau phay)</label>
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
          <label htmlFor="expectedSalary">Luong mong muon (VND/Thang)</label>
          <input
            id="expectedSalary"
            type="number"
            className={`form-input ${errors.expectedSalary ? 'error' : ''}`}
            placeholder="vd: 15000000"
            {...register('expectedSalary', {
              setValueAs: (value) => (value === '' ? undefined : Number(value)),
            })}
          />
          {errors.expectedSalary && <span className="error-message">{errors.expectedSalary.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="preferredLocation">Dia diem lam viec mong muon</label>
          <input
            id="preferredLocation"
            type="text"
            className={`form-input ${errors.preferredLocation ? 'error' : ''}`}
            placeholder="vd: Ho Chi Minh, Remote"
            {...register('preferredLocation')}
          />
          {errors.preferredLocation && <span className="error-message">{errors.preferredLocation.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="portfolioLinks">Lien ket Portfolio (cach nhau boi dau phay)</label>
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
            className="btn btn--primary"
            disabled={!isDirty || isPending}
          >
            {isPending ? 'Dang luu...' : 'Luu thong tin ung vien'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default memo(CandidateInfoForm)
