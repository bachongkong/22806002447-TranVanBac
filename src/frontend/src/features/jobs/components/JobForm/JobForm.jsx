import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'

import { useCreateJob, useUpdateJob, useUpdateJobStatus } from '../../hooks/useJobs'
import JobFormStepper from './JobFormStepper'
import JobFormStep1 from './JobFormStep1'
import JobFormStep2 from './JobFormStep2'
import JobFormStep3 from './JobFormStep3'
import './JobForm.css'

// ============================================
// Zod Validation Schema (mirrors backend Joi)
// ============================================
const jobFormSchema = z.object({
  title: z.string().min(3, 'Tiêu đề tối thiểu 3 ký tự').max(200, 'Tiêu đề tối đa 200 ký tự'),
  description: z.string().min(10, 'Mô tả tối thiểu 10 ký tự'),
  requirements: z.string().optional().default(''),
  benefits: z.string().optional().default(''),
  salaryRange: z.object({
    min: z.union([z.number().min(0, 'Lương tối thiểu ≥ 0'), z.nan()]).optional().nullable(),
    max: z.union([z.number().min(0, 'Lương tối đa ≥ 0'), z.nan()]).optional().nullable(),
  }).optional().default({})
    .refine(
      (data) => {
        const min = data?.min
        const max = data?.max
        if (!min || !max || isNaN(min) || isNaN(max)) return true
        return max >= min
      },
      { message: 'Lương tối đa phải ≥ lương tối thiểu', path: ['root'] }
    ),
  location: z.string().max(200, 'Tối đa 200 ký tự').optional().default(''),
  employmentType: z.string().optional().default(''),
  experienceLevel: z.string().optional().default(''),
  skills: z.array(z.string()).max(20, 'Tối đa 20 kỹ năng').optional().default([]),
  expiresAt: z.string().optional().nullable().default(null),
})

// Step-specific field names for validation
const STEP_FIELDS = {
  1: ['title', 'employmentType', 'experienceLevel', 'location', 'salaryRange', 'skills', 'expiresAt'],
  2: ['description', 'requirements', 'benefits'],
}

/**
 * JobForm — Multi-step wizard for creating/editing job postings
 * @param {Object} props
 * @param {Object} [props.initialData] - Job data for edit mode
 * @param {boolean} [props.isEditMode=false] - Edit mode flag
 */
export default function JobForm({ initialData = null, isEditMode = false }) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState([])

  const createJob = useCreateJob()
  const updateJob = useUpdateJob()
  const updateJobStatus = useUpdateJobStatus()

  const isSubmitting = createJob.isPending || updateJob.isPending || updateJobStatus.isPending

  // Build default values from initialData
  const defaultValues = {
    title: initialData?.title || '',
    description: initialData?.description || '',
    requirements: initialData?.requirements || '',
    benefits: initialData?.benefits || '',
    salaryRange: {
      min: initialData?.salaryRange?.min || null,
      max: initialData?.salaryRange?.max || null,
    },
    location: initialData?.location || '',
    employmentType: initialData?.employmentType || '',
    experienceLevel: initialData?.experienceLevel || '',
    skills: initialData?.skills || [],
    expiresAt: initialData?.expiresAt
      ? new Date(initialData.expiresAt).toISOString().split('T')[0]
      : '',
  }

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobFormSchema),
    defaultValues,
    mode: 'onBlur',
  })

  // -------------------------------------------
  // Step Navigation
  // -------------------------------------------
  const goToStep = (step) => {
    setCurrentStep(step)
  }

  const handleNext = async () => {
    // Validate current step fields
    const fields = STEP_FIELDS[currentStep]
    const isValid = await trigger(fields)

    if (!isValid) return

    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep])
    }

    setCurrentStep(prev => Math.min(prev + 1, 3))
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  // -------------------------------------------
  // Clean form data before sending to API
  // -------------------------------------------
  const cleanFormData = (data) => {
    const cleaned = { ...data }

    // Remove empty salary values
    if (cleaned.salaryRange) {
      if (!cleaned.salaryRange.min || isNaN(cleaned.salaryRange.min)) {
        delete cleaned.salaryRange.min
      }
      if (!cleaned.salaryRange.max || isNaN(cleaned.salaryRange.max)) {
        delete cleaned.salaryRange.max
      }
      if (!cleaned.salaryRange.min && !cleaned.salaryRange.max) {
        delete cleaned.salaryRange
      }
    }

    // Remove empty optional strings
    if (!cleaned.location) delete cleaned.location
    if (!cleaned.employmentType) delete cleaned.employmentType
    if (!cleaned.experienceLevel) delete cleaned.experienceLevel
    if (!cleaned.requirements) delete cleaned.requirements
    if (!cleaned.benefits) delete cleaned.benefits
    if (!cleaned.expiresAt) delete cleaned.expiresAt

    // Convert skills empty to undefined
    if (cleaned.skills?.length === 0) delete cleaned.skills

    return cleaned
  }

  // -------------------------------------------
  // Submit Handlers
  // -------------------------------------------

  /**
   * Lưu nháp — create or update as draft
   */
  const handleSaveDraft = async () => {
    const data = getValues()
    const cleaned = cleanFormData(data)

    // For draft, title is the only true requirement
    if (!cleaned.title || cleaned.title.length < 3) {
      await trigger('title')
      setCurrentStep(1)
      return
    }

    // Ensure description has at least a placeholder for draft
    if (!cleaned.description) {
      cleaned.description = '(Đang soạn)'
    }

    if (isEditMode && initialData?._id) {
      updateJob.mutate(
        { id: initialData._id, data: cleaned },
        { onSuccess: () => navigate('/hr/jobs') }
      )
    } else {
      createJob.mutate(cleaned, {
        onSuccess: () => navigate('/hr/jobs'),
      })
    }
  }

  /**
   * Gửi duyệt — create/update + set status to pending
   */
  const handleSubmitForReview = handleSubmit(async (data) => {
    const cleaned = cleanFormData(data)

    if (isEditMode && initialData?._id) {
      updateJob.mutate(
        { id: initialData._id, data: cleaned },
        {
          onSuccess: () => {
            updateJobStatus.mutate(
              { id: initialData._id, status: 'pending' },
              { onSuccess: () => navigate('/hr/jobs') }
            )
          },
        }
      )
    } else {
      createJob.mutate(cleaned, {
        onSuccess: (res) => {
          const newJobId = res.data?.data?._id
          if (newJobId) {
            updateJobStatus.mutate(
              { id: newJobId, status: 'pending' },
              { onSuccess: () => navigate('/hr/jobs') }
            )
          } else {
            navigate('/hr/jobs')
          }
        },
      })
    }
  })

  // -------------------------------------------
  // Render
  // -------------------------------------------
  return (
    <div className="job-form">
      <JobFormStepper
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={goToStep}
      />

      <div className="job-form__card">
        {/* Step Content */}
        {currentStep === 1 && (
          <JobFormStep1
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
        )}

        {currentStep === 2 && (
          <JobFormStep2
            register={register}
            errors={errors}
          />
        )}

        {currentStep === 3 && (
          <JobFormStep3
            getValues={getValues}
          />
        )}

        {/* Actions */}
        <div className="job-form__actions">
          {currentStep > 1 && (
            <button
              type="button"
              className="btn btn--outline"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              Quay lại
            </button>
          )}

          <button
            type="button"
            className="btn btn--outline"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu nháp'}
          </button>

          {currentStep < 3 ? (
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleNext}
            >
              Tiếp theo
            </button>
          ) : (
            <button
              type="button"
              className="btn btn--success"
              onClick={handleSubmitForReview}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang gửi...' : '🚀 Gửi duyệt'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
