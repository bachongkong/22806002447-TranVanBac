import { EMPLOYMENT_TYPES, EXPERIENCE_LEVELS } from '@shared/constants'
import SkillsInput from '../SkillsInput/SkillsInput'

/**
 * JobFormStep1 — Thông tin cơ bản
 * @param {Object} props
 * @param {Object} props.register - react-hook-form register
 * @param {Object} props.errors - form errors
 * @param {Function} props.setValue - react-hook-form setValue
 * @param {Function} props.watch - react-hook-form watch
 */
export default function JobFormStep1({ register, errors, setValue, watch }) {
  const skills = watch('skills') || []

  // Tomorrow's date for min expiresAt
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <div className="fade-in">
      {/* Title */}
      <div className="job-form__group">
        <label className="job-form__label job-form__label--required" htmlFor="job-title">
          Tiêu đề tin tuyển dụng
        </label>
        <input
          id="job-title"
          type="text"
          className={`job-form__input ${errors.title ? 'job-form__input--error' : ''}`}
          placeholder="VD: Senior Frontend Developer"
          autoFocus
          {...register('title')}
        />
        {errors.title && <span className="job-form__error">{errors.title.message}</span>}
      </div>

      {/* Employment Type + Experience Level */}
      <div className="job-form__row">
        <div className="job-form__group">
          <label className="job-form__label" htmlFor="job-employment-type">
            Loại hình công việc
          </label>
          <select
            id="job-employment-type"
            className="job-form__select"
            {...register('employmentType')}
          >
            <option value="">-- Chọn loại hình --</option>
            {EMPLOYMENT_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="job-form__group">
          <label className="job-form__label" htmlFor="job-experience-level">
            Kinh nghiệm
          </label>
          <select
            id="job-experience-level"
            className="job-form__select"
            {...register('experienceLevel')}
          >
            <option value="">-- Chọn mức kinh nghiệm --</option>
            {EXPERIENCE_LEVELS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Location */}
      <div className="job-form__group">
        <label className="job-form__label" htmlFor="job-location">
          Địa điểm làm việc
        </label>
        <input
          id="job-location"
          type="text"
          className="job-form__input"
          placeholder="VD: Hà Nội, TP. Hồ Chí Minh, Remote..."
          {...register('location')}
        />
      </div>

      {/* Salary Range */}
      <div className="job-form__group">
        <label className="job-form__label">Mức lương (VNĐ)</label>
        <div className="job-form__row">
          <div>
            <input
              id="job-salary-min"
              type="number"
              className={`job-form__input ${errors.salaryRange?.min ? 'job-form__input--error' : ''}`}
              placeholder="Tối thiểu"
              min="0"
              {...register('salaryRange.min', { valueAsNumber: true })}
            />
            {errors.salaryRange?.min && (
              <span className="job-form__error">{errors.salaryRange.min.message}</span>
            )}
          </div>
          <div>
            <input
              id="job-salary-max"
              type="number"
              className={`job-form__input ${errors.salaryRange?.max ? 'job-form__input--error' : ''}`}
              placeholder="Tối đa"
              min="0"
              {...register('salaryRange.max', { valueAsNumber: true })}
            />
            {errors.salaryRange?.max && (
              <span className="job-form__error">{errors.salaryRange.max.message}</span>
            )}
          </div>
        </div>
        {errors.salaryRange?.root && (
          <span className="job-form__error">{errors.salaryRange.root.message}</span>
        )}
        <span className="job-form__hint">Để trống nếu lương thỏa thuận</span>
      </div>

      {/* Skills */}
      <div className="job-form__group">
        <label className="job-form__label">Kỹ năng yêu cầu</label>
        <SkillsInput
          value={skills}
          onChange={(newSkills) => setValue('skills', newSkills, { shouldDirty: true })}
          maxItems={20}
        />
      </div>

      {/* Expires At */}
      <div className="job-form__group">
        <label className="job-form__label" htmlFor="job-expires-at">
          Hạn nộp hồ sơ
        </label>
        <input
          id="job-expires-at"
          type="date"
          className="job-form__input"
          min={minDate}
          {...register('expiresAt')}
        />
        <span className="job-form__hint">Để trống nếu không giới hạn thời gian</span>
      </div>
    </div>
  )
}
