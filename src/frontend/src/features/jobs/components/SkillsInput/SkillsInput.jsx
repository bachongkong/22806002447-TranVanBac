import { useState, useRef } from 'react'
import './SkillsInput.css'

/**
 * SkillsInput — Reusable tag input for skills
 * @param {Object} props
 * @param {string[]} props.value - Current skills array
 * @param {Function} props.onChange - Callback with updated array
 * @param {number} [props.maxItems=20] - Max number of skills
 * @param {string} [props.placeholder] - Input placeholder
 */
export default function SkillsInput({
  value = [],
  onChange,
  maxItems = 20,
  placeholder = 'Nhập kỹ năng và nhấn Enter...',
}) {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef(null)

  const isAtLimit = value.length >= maxItems

  const addSkill = (skill) => {
    const trimmed = skill.trim()
    if (!trimmed) return
    if (value.some((s) => s.toLowerCase() === trimmed.toLowerCase())) return
    if (isAtLimit) return

    onChange([...value, trimmed])
    setInputValue('')
  }

  const removeSkill = (index) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addSkill(inputValue)
    }
    // Backspace on empty → remove last tag
    if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeSkill(value.length - 1)
    }
  }

  const handleContainerClick = () => {
    inputRef.current?.focus()
  }

  return (
    <div className="skills-input">
      <div
        className={`skills-input__field ${isAtLimit ? 'skills-input__field--disabled' : ''}`}
        onClick={handleContainerClick}
      >
        {value.map((skill, index) => (
          <span key={`${skill}-${index}`} className="skill-tag">
            {skill}
            <button
              type="button"
              className="skill-tag__remove"
              onClick={(e) => {
                e.stopPropagation()
                removeSkill(index)
              }}
              aria-label={`Xóa ${skill}`}
            >
              ✕
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          className="skills-input__input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ''}
          disabled={isAtLimit}
        />
      </div>
      <span className={`skills-input__hint ${isAtLimit ? 'skills-input__hint--limit' : ''}`}>
        {value.length}/{maxItems} kỹ năng
        {!isAtLimit && ' — Nhấn Enter hoặc dấu phẩy để thêm'}
      </span>
    </div>
  )
}
