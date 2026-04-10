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
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
      />
      {value && (
        <button
          type="button"
          className="job-search-bar__clear"
          onClick={handleClear}
          aria-label="XÃ³a tÃ¬m kiáº¿m"
        >
          <FiX />
        </button>
      )}
    </div>
  )
}
