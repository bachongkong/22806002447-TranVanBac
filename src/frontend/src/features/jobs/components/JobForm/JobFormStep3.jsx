import { EMPLOYMENT_TYPES, EXPERIENCE_LEVELS } from '@shared/constants'
import { formatSalary, formatDate } from '@shared/utils'

/**
 * JobFormStep3 — Xem lại & Đăng
 * @param {Object} props
 * @param {Function} props.getValues - react-hook-form getValues
 */
export default function JobFormStep3({ getValues }) {
  const data = getValues()

  const employmentLabel = EMPLOYMENT_TYPES.find(t => t.value === data.employmentType)?.label
  const experienceLabel = EXPERIENCE_LEVELS.find(l => l.value === data.experienceLevel)?.label

  return (
    <div className="job-preview fade-in">
      {/* Header */}
      <div className="job-preview__header">
        <span className="badge badge--muted" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
          Nháp
        </span>
        <h2 className="job-preview__title">{data.title || 'Chưa có tiêu đề'}</h2>

        {/* Meta chips */}
        <div className="job-preview__meta">
          {employmentLabel && (
            <span className="job-preview__chip">
              
              {employmentLabel}
            </span>
          )}
          {experienceLabel && (
            <span className="job-preview__chip">
              
              {experienceLabel}
            </span>
          )}
          {data.location && (
            <span className="job-preview__chip">
              
              {data.location}
            </span>
          )}
          {(data.salaryRange?.min || data.salaryRange?.max) && (
            <span className="job-preview__chip">
              
              {formatSalary(data.salaryRange.min, data.salaryRange.max)}
            </span>
          )}
          {data.expiresAt && (
            <span className="job-preview__chip">
              
              Hạn: {formatDate(data.expiresAt)}
            </span>
          )}
        </div>
      </div>

      {/* Skills */}
      {data.skills?.length > 0 && (
        <div className="job-preview__section">
          <h3 className="job-preview__section-title">Kỹ năng yêu cầu</h3>
          <div className="job-preview__skills">
            {data.skills.map((skill, index) => (
              <span key={`${skill}-${index}`} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="job-preview__section">
        <h3 className="job-preview__section-title">Mô tả công việc</h3>
        <p className={`job-preview__text ${!data.description ? 'job-preview__text--empty' : ''}`}>
          {data.description || 'Chưa có mô tả'}
        </p>
      </div>

      {/* Requirements */}
      <div className="job-preview__section">
        <h3 className="job-preview__section-title">Yêu cầu ứng viên</h3>
        <p className={`job-preview__text ${!data.requirements ? 'job-preview__text--empty' : ''}`}>
          {data.requirements || 'Không có yêu cầu cụ thể'}
        </p>
      </div>

      {/* Benefits */}
      <div className="job-preview__section">
        <h3 className="job-preview__section-title">Phúc lợi & Chế độ</h3>
        <p className={`job-preview__text ${!data.benefits ? 'job-preview__text--empty' : ''}`}>
          {data.benefits || 'Chưa có thông tin phúc lợi'}
        </p>
      </div>
    </div>
  )
}
