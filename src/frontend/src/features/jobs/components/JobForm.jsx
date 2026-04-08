import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobSchema } from '../jobSchemas.js';
import './JobForm.css';

const JobForm = ({ initialValues, onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: initialValues || {
      title: '',
      description: '',
      requirements: '',
      employmentType: 'full-time',
      location: '',
      salaryRange: { min: null, max: null }
    },
  });

  const handleFormSubmit = (data) => {
    // Clean payload before submitting (e.g strip NaNs)
    if (isNaN(data.salaryRange?.min)) data.salaryRange.min = undefined;
    if (isNaN(data.salaryRange?.max)) data.salaryRange.max = undefined;
    
    onSubmit(data);
  };

  return (
    <form className="job-form" onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="form-group">
        <label>Tiêu đề công việc <span className="required">*</span></label>
        <input 
          type="text" 
          {...register('title')} 
          placeholder="VD: Senior Frontend Developer (React/Vite)" 
        />
        {errors.title && <span className="error-text">{errors.title.message}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Loại hình <span className="required">*</span></label>
          <select {...register('employmentType')}>
            <option value="full-time">Toàn thời gian (Full-time)</option>
            <option value="part-time">Bán thời gian (Part-time)</option>
            <option value="contract">Hợp đồng (Contract)</option>
            <option value="freelance">Tự do (Freelance)</option>
            <option value="internship">Thực tập sinh (Internship)</option>
          </select>
          {errors.employmentType && <span className="error-text">{errors.employmentType.message}</span>}
        </div>

        <div className="form-group">
          <label>Địa điểm làm việc <span className="required">*</span></label>
          <input 
            type="text" 
            {...register('location')} 
            placeholder="TP.HCM, Hà Nội..." 
          />
          {errors.location && <span className="error-text">{errors.location.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Lương tối thiểu (Tùy chọn - USD)</label>
          <input 
            type="number" 
            {...register('salaryRange.min', { valueAsNumber: true })} 
            placeholder="1000" 
          />
          {errors.salaryRange?.min && <span className="error-text">{errors.salaryRange.min.message}</span>}
        </div>
        <div className="form-group">
          <label>Lương tối đa (Tùy chọn - USD)</label>
          <input 
            type="number" 
            {...register('salaryRange.max', { valueAsNumber: true })} 
            placeholder="3000" 
          />
          {errors.salaryRange?.max && <span className="error-text">{errors.salaryRange.max.message}</span>}
        </div>
      </div>

      <div className="form-group">
        <label>Mô tả công việc <span className="required">*</span></label>
        <textarea 
          rows="5" 
          {...register('description')} 
          placeholder="Mô tả chi tiết quyền lợi, môi trường làm việc..." 
        />
        {errors.description && <span className="error-text">{errors.description.message}</span>}
      </div>

      <div className="form-group">
        <label>Yêu cầu ứng viên <span className="required">*</span></label>
        <textarea 
          rows="5" 
          {...register('requirements')} 
          placeholder="Yêu cầu về kỹ năng, kinh nghiệm chuyên môn..." 
        />
        {errors.requirements && <span className="error-text">{errors.requirements.message}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn--primary" disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : 'Lưu công việc'}
        </button>
      </div>
    </form>
  );
};

export default JobForm;
