import { useState } from 'react'
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { EMPLOYMENT_TYPES, EXPERIENCE_LEVELS } from '@shared/constants'
import './JobFilterPanel.css'

export default function JobFilterPanel({ filters, onChange }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const activeCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== '' && v !== null
  ).length

  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value || undefined })
  }

  const handleReset = () => {
    onChange({})
  }

  return (
    <div className="job-filter-panel">
      <div className="job-filter-panel__header">
        <button
          id="filter-toggle-btn"
          className="job-filter-panel__toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <FiFilter />
          <span>Bộ lọc</span>
          {activeCount > 0 && (
            <span className="job-filter-panel__count">{activeCount}</span>
          )}
          {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
        </button>

        {activeCount > 0 && (
          <button className="job-filter-panel__reset" onClick={handleReset}>
            <FiX size={14} />
            Xóa bộ lọc
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="job-filter-panel__body">
          <div className="job-filter-panel__group">
            <label className="job-filter-panel__label">Loại hình</label>
            <select
              id="filter-employment-type"
              className="job-filter-panel__select"
              value={filters.employmentType || ''}
              onChange={(e) => handleChange('employmentType', e.target.value)}
            >
              <option value="">Tất cả</option>
              {EMPLOYMENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="job-filter-panel__group">
            <label className="job-filter-panel__label">Kinh nghiệm</label>
            <select
              id="filter-experience-level"
              className="job-filter-panel__select"
              value={filters.experienceLevel || ''}
              onChange={(e) => handleChange('experienceLevel', e.target.value)}
            >
              <option value="">Tất cả</option>
              {EXPERIENCE_LEVELS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <div className="job-filter-panel__group">
            <label className="job-filter-panel__label">Địa điểm</label>
            <input
              id="filter-location"
              type="text"
              className="job-filter-panel__input"
              placeholder="VD: Hồ Chí Minh, Hà Nội..."
              value={filters.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
            />
          </div>

          <div className="job-filter-panel__group">
            <label className="job-filter-panel__label">Lương tối thiểu (VNĐ)</label>
            <input
              id="filter-salary-min"
              type="number"
              className="job-filter-panel__input"
              placeholder="VD: 10000000"
              value={filters.salaryMin || ''}
              onChange={(e) => handleChange('salaryMin', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
