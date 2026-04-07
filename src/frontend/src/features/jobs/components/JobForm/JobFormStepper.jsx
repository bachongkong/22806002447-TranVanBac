import { HiOutlineCheck } from 'react-icons/hi2'
import './JobForm.css'

const STEPS = [
  { number: 1, label: 'Thông tin cơ bản' },
  { number: 2, label: 'Yêu cầu & Phúc lợi' },
  { number: 3, label: 'Xem lại & Đăng' },
]

/**
 * JobFormStepper — Progress stepper for job wizard
 * @param {Object} props
 * @param {number} props.currentStep - Current active step (1-3)
 * @param {Function} props.onStepClick - Callback when clicking completed step
 * @param {number[]} props.completedSteps - Array of completed step numbers
 */
export default function JobFormStepper({ currentStep, onStepClick, completedSteps = [] }) {
  const getStepStatus = (stepNumber) => {
    if (stepNumber === currentStep) return 'active'
    if (completedSteps.includes(stepNumber)) return 'completed'
    return 'upcoming'
  }

  return (
    <div className="job-stepper">
      {STEPS.map((step, index) => {
        const status = getStepStatus(step.number)
        const isClickable = status === 'completed'

        return (
          <div key={step.number} className="job-stepper__item">
            {/* Connecting line (before step, except first) */}
            {index > 0 && (
              <div
                className={`job-stepper__line ${
                  status === 'active' || status === 'completed'
                    ? 'job-stepper__line--active'
                    : ''
                }`}
              />
            )}

            {/* Step circle */}
            <button
              type="button"
              className={`job-stepper__circle job-stepper__circle--${status}`}
              onClick={() => isClickable && onStepClick(step.number)}
              disabled={!isClickable}
              aria-label={`Bước ${step.number}: ${step.label}`}
            >
              {status === 'completed' ? (
                <HiOutlineCheck className="job-stepper__check" />
              ) : (
                step.number
              )}
            </button>

            {/* Step label */}
            <span className={`job-stepper__label job-stepper__label--${status}`}>
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
