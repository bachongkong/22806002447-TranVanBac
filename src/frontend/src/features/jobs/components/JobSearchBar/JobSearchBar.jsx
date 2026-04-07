import { useState } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import './JobSearchBar.css'

export default function JobSearchBar({ value, onChange }) {
  const handleClear = () => {
    onChange('')
  }

  return (
    <div className="job-search-bar">
      <div className="job-search-bar__icon">
        <FiSearch />
      </div>
      <input
        id="job-search-input"
        type="text"
        className="job-search-bar__input"
        placeholder="Tìm kiếm theo vị trí, công ty, kỹ năng..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
      {value && (
        <button
          className="job-search-bar__clear"
          onClick={handleClear}
          aria-label="Xóa tìm kiếm"
        >
          <FiX />
        </button>
      )}
    </div>
  )
}
