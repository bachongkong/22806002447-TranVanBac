import { lazy, Suspense } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FiCalendar, FiMapPin, FiVideo, FiX } from 'react-icons/fi'

import { useScheduleInterview } from '../../hooks/useInterviews'

import './ScheduleInterviewModal.css'

const DateTimePicker = lazy(() => import('../DateTimePicker/DateTimePicker'))

function DateTimePickerFallback() {
  return (
    <div className="im-dtp-loading">
      <div className="im-dtp-loading__spinner" />
      Đang tải bộ chọn ngày giờ...
    </div>
  )
}

const scheduleSchema = z.object({
  scheduledAt: z.string().min(1, 'Vui lòng chọn ngày giờ phỏng vấn'),
  type: z.enum(['online', 'offline'], {
    errorMap: () => ({ message: 'Vui lòng chọn hình thức phỏng vấn' }),
  }),
  meetingLink: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().max(2000, 'Ghi chú tối đa 2000 ký tự').optional(),
  roundNumber: z.coerce.number().int().min(1).default(1),
}).refine(
  (data) => {
    if (data.type === 'online') return !!data.meetingLink?.trim()
    return true
  },
  { message: 'Vui lòng nhập link họp trực tuyến', path: ['meetingLink'] }
).refine(
  (data) => {
    if (data.type === 'offline') return !!data.location?.trim()
    return true
  },
  { message: 'Vui lòng nhập địa điểm phỏng vấn', path: ['location'] }
)

export default function ScheduleInterviewModal({ application, onClose, jobId }) {
  const candidate = application.candidateId || {}
  const fullName = candidate.profile?.fullName || candidate.email || 'Ứng viên'
  const email = candidate.email || ''
  const initial = fullName.charAt(0).toUpperCase()

  const scheduleInterview = useScheduleInterview(jobId)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      scheduledAt: '',
      type: 'online',
      meetingLink: '',
      location: '',
      notes: '',
      roundNumber: 1,
    },
  })

  const interviewType = useWatch({
    control,
    name: 'type',
  })

  const handleFormSubmit = (data) => {
    scheduleInterview.mutate(
      {
        applicationId: application._id,
        scheduledAt: data.scheduledAt,
        type: data.type,
        meetingLink: data.type === 'online' ? data.meetingLink : '',
        location: data.type === 'offline' ? data.location : '',
        notes: data.notes || '',
        roundNumber: data.roundNumber,
      },
      {
        onSuccess: () => onClose(),
      }
    )
  }

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)

  return (
    <div className="interview-modal-overlay" onClick={onClose}>
      <div className="interview-modal" onClick={(event) => event.stopPropagation()}>
        <div className="interview-modal__header">
          <h2 className="interview-modal__title">
            <FiCalendar className="interview-modal__title-icon" />
            Lên lịch phỏng vấn
          </h2>
          <button className="interview-modal__close" onClick={onClose} type="button">
            <FiX />
          </button>
        </div>

        <div className="interview-modal__candidate">
          <div className="interview-modal__candidate-avatar">{initial}</div>
          <div>
            <div className="interview-modal__candidate-name">{fullName}</div>
            {email && <div className="interview-modal__candidate-email">{email}</div>}
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="interview-modal__body">
            <Controller
              name="scheduledAt"
              control={control}
              render={({ field }) => (
                <Suspense fallback={<DateTimePickerFallback />}>
                  <DateTimePicker
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.scheduledAt?.message}
                    label="Thời gian phỏng vấn"
                    required
                    minDate={minDate.toISOString()}
                  />
                </Suspense>
              )}
            />

            <div className="im-form__group">
              <label className="im-form__label im-form__label--required">Hình thức</label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <div className="im-type-toggle">
                    <button
                      type="button"
                      className={`im-type-toggle__btn ${field.value === 'online' ? 'im-type-toggle__btn--active' : ''}`}
                      onClick={() => field.onChange('online')}
                    >
                      <FiVideo className="im-type-toggle__icon" />
                      Online
                    </button>
                    <button
                      type="button"
                      className={`im-type-toggle__btn ${field.value === 'offline' ? 'im-type-toggle__btn--active' : ''}`}
                      onClick={() => field.onChange('offline')}
                    >
                      <FiMapPin className="im-type-toggle__icon" />
                      Offline
                    </button>
                  </div>
                )}
              />
              {errors.type && <span className="im-form__error">{errors.type.message}</span>}
            </div>

            {interviewType === 'online' ? (
              <div className="im-form__group">
                <label className="im-form__label im-form__label--required" htmlFor="im-meeting-link">
                  Link họp trực tuyến
                </label>
                <input
                  id="im-meeting-link"
                  type="url"
                  className="im-form__input"
                  placeholder="https://meet.google.com/..."
                  {...register('meetingLink')}
                />
                {errors.meetingLink && (
                  <span className="im-form__error">{errors.meetingLink.message}</span>
                )}
              </div>
            ) : (
              <div className="im-form__group">
                <label className="im-form__label im-form__label--required" htmlFor="im-location">
                  Địa điểm phỏng vấn
                </label>
                <input
                  id="im-location"
                  type="text"
                  className="im-form__input"
                  placeholder="Tầng 5, Tòa nhà ABC, Quận 1, TP.HCM"
                  {...register('location')}
                />
                {errors.location && (
                  <span className="im-form__error">{errors.location.message}</span>
                )}
              </div>
            )}

            <div className="im-form__group">
              <label className="im-form__label" htmlFor="im-round">
                Vòng phỏng vấn
              </label>
              <select id="im-round" className="im-form__select" {...register('roundNumber')}>
                <option value={1}>Vòng 1 — Sơ tuyển</option>
                <option value={2}>Vòng 2 — Chuyên môn</option>
                <option value={3}>Vòng 3 — Cuối</option>
              </select>
            </div>

            <div className="im-form__group">
              <label className="im-form__label" htmlFor="im-notes">
                Ghi chú
              </label>
              <textarea
                id="im-notes"
                className="im-form__textarea"
                placeholder="Ghi chú nội bộ cho buổi phỏng vấn (không gửi cho ứng viên)..."
                rows={3}
                {...register('notes')}
              />
              {errors.notes && <span className="im-form__error">{errors.notes.message}</span>}
            </div>
          </div>

          <div className="interview-modal__footer">
            <button
              type="button"
              className="btn btn--outline"
              onClick={onClose}
              disabled={scheduleInterview.isPending}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={scheduleInterview.isPending}
            >
              {scheduleInterview.isPending ? 'Đang lên lịch...' : '🗓️ Xác nhận lên lịch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
