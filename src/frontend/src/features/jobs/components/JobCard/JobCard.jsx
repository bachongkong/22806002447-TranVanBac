import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatSalary, timeAgo } from '@shared/utils'
import { useAuthStore } from '@app/store'
import { useToggleFavoriteJob } from '@features/jobs'
import './JobCard.css'

export default function JobCard({ job, style }) {
  const navigate = useNavigate()
  const isCandidate = useAuthStore(state => state.isCandidate())
  const [isSavedLocal, setIsSavedLocal] = useState(!!job.isSaved)
  const [isAnim, setIsAnim] = useState(false)
  const { mutate } = useToggleFavoriteJob()


  const company = job.companyId || {}

  const handleClick = () => {
    navigate(`/jobs/${job._id}`)
  }

  const handleSave = (e) => {
    e.stopPropagation()
    if (!isCandidate) return

    const prev = isSavedLocal
    setIsSavedLocal(!prev)
    
    if (!prev) {
      setIsAnim(true)
      setTimeout(() => setIsAnim(false), 300)
    }

    mutate(job._id, {
      onError: () => setIsSavedLocal(prev)
    })
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
              
              {job.location || 'Chưa cập nhật'}
            </span>
            <span className="job-card__meta-item">
              
              {job.employmentType || 'Full-time'}
            </span>
            {job.experienceLevel && (
              <span className="job-card__meta-item">
                
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

        <div className="job-card__aside">
          <div className="job-card__salary">
            
            {formatSalary(job.salaryRange?.min, job.salaryRange?.max)}
          </div>
          <div className="job-card__bottom-right">
            <span className="job-card__time">{timeAgo(job.createdAt)}</span>
            {isCandidate && (
              <button 
                className={`job-card__save-btn ${isSavedLocal ? 'is-saved' : ''} ${isAnim ? 'animate-pop' : ''}`}
                onClick={handleSave}
                title={isSavedLocal ? "Bỏ lưu tin này" : "Lưu tin này"}
              >
                {isSavedLocal ? 'Đã lưu' : 'Lưu'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
