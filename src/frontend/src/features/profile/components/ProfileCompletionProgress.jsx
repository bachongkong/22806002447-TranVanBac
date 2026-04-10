import { memo, useMemo } from 'react'
import './ProfileCompletionProgress.css'

const PROFILE_FIELDS = {
  candidate: [
    { key: 'fullName', label: 'Ho va ten', validate: (val) => typeof val === 'string' && val.trim().length > 0 },
    { key: 'avatar', label: 'Anh dai dien', validate: (val) => typeof val === 'string' && val.trim().length > 0 },
    { key: 'phone', label: 'So dien thoai', validate: (val) => typeof val === 'string' && val.trim().length > 0 },
    { key: 'address', label: 'Dia chi', validate: (val) => typeof val === 'string' && val.trim().length > 0 },
    { key: 'skills', label: 'Ky nang', validate: (val) => Array.isArray(val) && val.length > 0 },
    { key: 'portfolioLinks', label: 'Portfolio', validate: (val) => Array.isArray(val) && val.length > 0 },
    { key: 'expectedSalary', label: 'Luong mong muon', validate: (val) => typeof val === 'number' && val > 0 },
    { key: 'preferredLocation', label: 'Dia diem lam viec', validate: (val) => typeof val === 'string' && val.trim().length > 0 },
  ],
  hr: [
    { key: 'fullName', label: 'Ho va ten', validate: (val) => typeof val === 'string' && val.trim().length > 0 },
    { key: 'avatar', label: 'Anh dai dien', validate: (val) => typeof val === 'string' && val.trim().length > 0 },
    { key: 'phone', label: 'So dien thoai', validate: (val) => typeof val === 'string' && val.trim().length > 0 },
    { key: 'address', label: 'Dia chi', validate: (val) => typeof val === 'string' && val.trim().length > 0 },
    { key: 'roleTitle', label: 'Chuc danh nhan su', validate: (val) => typeof val === 'string' && val.trim().length > 0 },
  ],
}

function ProfileCompletionProgress({ profile, role = 'candidate' }) {
  const completionState = useMemo(() => {
    if (!profile) return { percentage: 0, missingFields: [] }

    const fieldsToCheck = PROFILE_FIELDS[role] || PROFILE_FIELDS.candidate
    let completedCount = 0
    const missingFields = []

    fieldsToCheck.forEach((field) => {
      if (field.validate(profile[field.key])) {
        completedCount += 1
      } else {
        missingFields.push(field.label)
      }
    })

    const percentage = Math.round((completedCount / fieldsToCheck.length) * 100)

    let colorClass = 'bar-danger'
    if (percentage >= 80) colorClass = 'bar-success'
    else if (percentage >= 50) colorClass = 'bar-warning'

    return {
      percentage,
      missingFields,
      colorClass,
    }
  }, [profile, role])

  const { percentage, missingFields, colorClass } = completionState

  if (percentage === 100) return null

  return (
    <div className="profile-completion">
      <div className="profile-completion__header">
        <h4 className="profile-completion__title">Hoan thien ho so: {percentage}%</h4>
        {percentage < 100 && (
          <span className="profile-completion__subtitle">
            Hoan thien them de giup ho so day du va de theo doi hon
          </span>
        )}
      </div>

      <div className="profile-completion__progress-bar">
        <div
          className={`profile-completion__progress-fill ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {missingFields.length > 0 && (
        <div className="profile-completion__missing">
          <strong>Thong tin con thieu: </strong>
          <span>{missingFields.join(', ')}</span>
        </div>
      )}
    </div>
  )
}

export default memo(ProfileCompletionProgress)
