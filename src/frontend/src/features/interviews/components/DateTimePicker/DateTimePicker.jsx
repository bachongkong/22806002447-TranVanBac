import { useState, useMemo, useCallback } from 'react'
import dayjs from 'dayjs'
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import './DateTimePicker.css'

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
const QUICK_TIMES = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '14:00', '14:30', '15:00', '15:30', '16:00']

/**
 * DateTimePicker — Custom Date & Time picker
 * 🔥 This component is CODE SPLIT via React.lazy()
 * It only loads when the Schedule Interview modal opens
 *
 * @param {Object} props
 * @param {string} props.value - ISO date string or empty
 * @param {Function} props.onChange - (isoString) => void
 * @param {string} [props.error] - validation error message
 * @param {string} [props.label] - field label
 * @param {boolean} [props.required] - show required indicator
 * @param {string} [props.minDate] - minimum selectable date (ISO string)
 */
export default function DateTimePicker({
  value,
  onChange,
  error,
  label = 'Chọn ngày giờ',
  required = false,
  minDate,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() =>
    value ? dayjs(value) : dayjs()
  )

  // Parse current value
  const selectedDate = value ? dayjs(value) : null
  const selectedHour = selectedDate ? String(selectedDate.hour()).padStart(2, '0') : '09'
  const selectedMinute = selectedDate ? String(selectedDate.minute()).padStart(2, '0') : '00'

  const minDayjs = minDate ? dayjs(minDate).startOf('day') : dayjs().startOf('day')

  // ---------- Calendar Logic ----------
  const calendarDays = useMemo(() => {
    const startOfMonth = viewDate.startOf('month')
    const endOfMonth = viewDate.endOf('month')
    const startDay = startOfMonth.day() // 0 = Sunday

    const days = []

    // Previous month days
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: startOfMonth.subtract(i + 1, 'day'),
        isCurrentMonth: false,
      })
    }

    // Current month days
    for (let d = 1; d <= endOfMonth.date(); d++) {
      days.push({
        date: viewDate.date(d),
        isCurrentMonth: true,
      })
    }

    // Next month days (fill to 42 = 6 rows)
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: endOfMonth.add(i, 'day'),
        isCurrentMonth: false,
      })
    }

    return days
  }, [viewDate])

  // ---------- Handlers ----------
  const handleDayClick = useCallback(
    (date) => {
      const hour = selectedDate ? selectedDate.hour() : 9
      const minute = selectedDate ? selectedDate.minute() : 0
      const newDate = date.hour(hour).minute(minute).second(0)
      onChange(newDate.toISOString())
    },
    [selectedDate, onChange]
  )

  const handleTimeChange = useCallback(
    (type, val) => {
      const base = selectedDate || dayjs().hour(9).minute(0).second(0)
      let newDate
      if (type === 'hour') {
        const h = Math.max(0, Math.min(23, parseInt(val) || 0))
        newDate = base.hour(h)
      } else {
        const m = Math.max(0, Math.min(59, parseInt(val) || 0))
        newDate = base.minute(m)
      }
      onChange(newDate.second(0).toISOString())
    },
    [selectedDate, onChange]
  )

  const handleQuickTime = useCallback(
    (timeStr) => {
      const [h, m] = timeStr.split(':').map(Number)
      const base = selectedDate || dayjs()
      onChange(base.hour(h).minute(m).second(0).toISOString())
    },
    [selectedDate, onChange]
  )

  const prevMonth = () => setViewDate((d) => d.subtract(1, 'month'))
  const nextMonth = () => setViewDate((d) => d.add(1, 'month'))

  const isToday = (date) => date.isSame(dayjs(), 'day')
  const isSelected = (date) => selectedDate && date.isSame(selectedDate, 'day')
  const isDisabled = (date) => date.isBefore(minDayjs, 'day')

  // Format display text
  const displayText = selectedDate
    ? selectedDate.format('DD/MM/YYYY — HH:mm')
    : null

  const activeQuickTime = `${selectedHour}:${selectedMinute}`

  return (
    <div className="datetime-picker">
      {label && (
        <label className={`datetime-picker__label ${required ? 'datetime-picker__label--required' : ''}`}>
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        className="datetime-picker__trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiCalendar className="datetime-picker__trigger-icon" />
        <span className={`datetime-picker__trigger-text ${!displayText ? 'datetime-picker__trigger-text--placeholder' : ''}`}>
          {displayText || 'Nhấn để chọn ngày giờ...'}
        </span>
      </button>

      {error && <span className="datetime-picker__error">{error}</span>}

      {/* Dropdown */}
      {isOpen && (
        <div className="datetime-picker__dropdown">
          <div className="datetime-picker__sections">
            {/* ---- Date Section ---- */}
            <div>
              <div className="datetime-picker__section-title">Ngày phỏng vấn</div>
              <div className="dtp-calendar">
                {/* Month nav */}
                <div className="dtp-calendar__nav">
                  <button type="button" className="dtp-calendar__nav-btn" onClick={prevMonth}>
                    <FiChevronLeft />
                  </button>
                  <span className="dtp-calendar__month-year">
                    {viewDate.format('MMMM YYYY')}
                  </span>
                  <button type="button" className="dtp-calendar__nav-btn" onClick={nextMonth}>
                    <FiChevronRight />
                  </button>
                </div>

                {/* Grid */}
                <div className="dtp-calendar__grid">
                  {WEEKDAYS.map((wd) => (
                    <div key={wd} className="dtp-calendar__weekday">{wd}</div>
                  ))}
                  {calendarDays.map(({ date, isCurrentMonth }, i) => (
                    <button
                      key={i}
                      type="button"
                      disabled={isDisabled(date)}
                      className={[
                        'dtp-calendar__day',
                        !isCurrentMonth && 'dtp-calendar__day--other-month',
                        isToday(date) && 'dtp-calendar__day--today',
                        isSelected(date) && 'dtp-calendar__day--selected',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => handleDayClick(date)}
                    >
                      {date.date()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ---- Time Section ---- */}
            <div>
              <div className="datetime-picker__section-title">Giờ phỏng vấn</div>
              <div className="dtp-time">
                <div className="dtp-time__inputs">
                  <div className="dtp-time__input-group">
                    <span className="dtp-time__input-label">Giờ</span>
                    <input
                      type="number"
                      className="dtp-time__input"
                      min="0"
                      max="23"
                      value={selectedHour}
                      onChange={(e) => handleTimeChange('hour', e.target.value)}
                    />
                  </div>
                  <span className="dtp-time__separator">:</span>
                  <div className="dtp-time__input-group">
                    <span className="dtp-time__input-label">Phút</span>
                    <input
                      type="number"
                      className="dtp-time__input"
                      min="0"
                      max="59"
                      step="5"
                      value={selectedMinute}
                      onChange={(e) => handleTimeChange('minute', e.target.value)}
                    />
                  </div>
                </div>

                {/* Quick times */}
                <div className="dtp-time__quick">
                  {QUICK_TIMES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`dtp-time__quick-btn ${activeQuickTime === t ? 'dtp-time__quick-btn--active' : ''}`}
                      onClick={() => handleQuickTime(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="datetime-picker__footer">
            <button
              type="button"
              className="btn btn--outline"
              onClick={() => setIsOpen(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
