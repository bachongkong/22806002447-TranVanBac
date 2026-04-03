import { memo, useMemo } from 'react'
import './ProfileCompletionProgress.css'

function ProfileCompletionProgress({ profile }) {
  const completionState = useMemo(() => {
    if (!profile) return { percentage: 0, missingFields: [] }

    const fieldsToCheck = [
      { key: 'fullName', label: 'Họ và tên', validate: (val) => typeof val === 'string' && val.trim().length > 0 },
      { key: 'avatar', label: 'Ảnh đại diện', validate: (val) => typeof val === 'string' && val.trim().length > 0 },
      { key: 'phone', label: 'Số điện thoại', validate: (val) => typeof val === 'string' && val.trim().length > 0 },
      { key: 'address', label: 'Địa chỉ', validate: (val) => typeof val === 'string' && val.trim().length > 0 },
      { key: 'skills', label: 'Kỹ năng', validate: (val) => Array.isArray(val) && val.length > 0 },
      { key: 'education', label: 'Học vấn', validate: (val) => Array.isArray(val) && val.length > 0 },
      { key: 'experience', label: 'Kinh nghiệm làm việc', validate: (val) => Array.isArray(val) && val.length > 0 },
      { key: 'portfolioLinks', label: 'Portfolio', validate: (val) => Array.isArray(val) && val.length > 0 },
      { key: 'expectedSalary', label: 'Lương mong muốn', validate: (val) => typeof val === 'number' && val > 0 },
      { key: 'preferredLocation', label: 'Địa điểm làm việc', validate: (val) => typeof val === 'string' && val.trim().length > 0 },
    ]

    let completedCount = 0
    const missingFields = []

    fieldsToCheck.forEach((field) => {
      if (field.validate(profile[field.key])) {
        completedCount++
      } else {
        missingFields.push(field.label)
      }
    })

    const percentage = Math.round((completedCount / fieldsToCheck.length) * 100)
    
    // Determine bar color based on percentage
    let colorClass = 'bar-danger'
    if (percentage >= 80) colorClass = 'bar-success'
    else if (percentage >= 50) colorClass = 'bar-warning'

    return {
      percentage,
      missingFields,
      completedCount,
      totalCount: fieldsToCheck.length,
      colorClass
    }
  }, [profile])

  const { percentage, missingFields, colorClass } = completionState

  if (percentage === 100) return null

  return (
    <div className="profile-completion">
      <div className="profile-completion__header">
        <h4 className="profile-completion__title">Hoàn thiện hồ sơ: {percentage}%</h4>
        {percentage < 100 && (
          <span className="profile-completion__subtitle">
            Hoàn thiện thêm để tăng cơ hội tiếp cận nhà tuyển dụng
          </span>
        )}
      </div>
      
      <div className="profile-completion__progress-bar">
        <div 
          className={`profile-completion__progress-fill ${colorClass}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {missingFields.length > 0 && (
        <div className="profile-completion__missing">
          <strong>Thông tin còn thiếu: </strong>
          <span>{missingFields.join(', ')}</span>
        </div>
      )}
    </div>
  )
}

export default memo(ProfileCompletionProgress)
