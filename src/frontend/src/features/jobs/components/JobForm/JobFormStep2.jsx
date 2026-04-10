/**
 * JobFormStep2 — Mô tả & Phúc lợi
 * @param {Object} props
 * @param {Object} props.register - react-hook-form register
 * @param {Object} props.errors - form errors
 */
export default function JobFormStep2({ register, errors }) {
  return (
    <div className="fade-in">
      {/* Description */}
      <div className="job-form__group">
        <label className="job-form__label job-form__label--required" htmlFor="job-description">
          Mô tả công việc
        </label>
        <textarea
          id="job-description"
          className={`job-form__textarea ${errors.description ? 'job-form__textarea--error' : ''}`}
          rows={8}
          placeholder="Mô tả chi tiết về công việc, trách nhiệm và kỳ vọng hàng ngày..."
          {...register('description')}
        />
        {errors.description && (
          <span className="job-form__error">{errors.description.message}</span>
        )}
      </div>

      {/* Requirements */}
      <div className="job-form__group">
        <label className="job-form__label" htmlFor="job-requirements">
          Yêu cầu ứng viên
        </label>
        <textarea
          id="job-requirements"
          className="job-form__textarea"
          rows={6}
          placeholder="VD: Kinh nghiệm, kỹ năng, học vấn, chứng chỉ cần thiết cho vị trí này..."
          {...register('requirements')}
        />
      </div>

      {/* Benefits */}
      <div className="job-form__group">
        <label className="job-form__label" htmlFor="job-benefits">
          Phúc lợi & Chế độ
        </label>
        <textarea
          id="job-benefits"
          className="job-form__textarea"
          rows={6}
          placeholder="VD: Lương thưởng hấp dẫn, bảo hiểm, du lịch hàng năm, môi trường làm việc..."
          {...register('benefits')}
        />
      </div>
    </div>
  )
}
