import { useNavigate } from 'react-router-dom'
import { FiMapPin, FiBriefcase, FiClock, FiDollarSign } from 'react-icons/fi'
import { formatSalary, timeAgo } from '@shared/utils'
import './JobCard.css'

export default function JobCard({ job, style }) {
  const navigate = useNavigate()

  const company = job.companyId || {}

  const handleClick = () => {
    navigate(`/jobs/${job._id}`)
  }

  return (
    <div className="job-card" style={style} onClick={handleClick}>
      <div className="job-card__inner">
        {/* Logo */}
        <div className="job-card__logo">
          {company.logo ? (
            <img src={company.logo} alt={company.name} />
          ) : (
            <div className="job-card__logo-placeholder">
              {(company.name || 'C').charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="job-card__content">
          <h3 className="job-card__title">{job.title}</h3>
          <p className="job-card__company">{company.name || 'Công ty'}</p>

          <div className="job-card__meta">
            <span className="job-card__meta-item">
              <FiMapPin size={14} />
              {job.location || 'Chưa cập nhật'}
            </span>
            <span className="job-card__meta-item">
              <FiBriefcase size={14} />
              {job.employmentType || 'Full-time'}
            </span>
            {job.experienceLevel && (
              <span className="job-card__meta-item">
                <FiClock size={14} />
                {job.experienceLevel}
              </span>
            )}
          </div>

          {/* Skills tags */}
          {job.skills?.length > 0 && (
            <div className="job-card__skills">
              {job.skills.slice(0, 4).map((skill, i) => (
                <span key={i} className="job-card__skill-tag">
                  {skill}
                </span>
              ))}
              {job.skills.length > 4 && (
                <span className="job-card__skill-more">
                  +{job.skills.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right section: salary + time */}
        <div className="job-card__aside">
          <div className="job-card__salary">
            <FiDollarSign size={14} />
            {formatSalary(job.salaryRange?.min, job.salaryRange?.max)}
          </div>
          <span className="job-card__time">{timeAgo(job.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}
