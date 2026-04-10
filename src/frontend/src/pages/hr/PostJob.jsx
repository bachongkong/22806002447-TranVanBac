import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import JobForm from '../../features/jobs/components/JobForm';
import axios from 'axios';

const PostJob = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Dùng axios chọt thẳng xuống backend với config mặc định (cookies/token)
      await axios.post('/api/jobs', data, { withCredentials: true });
      toast.success('Đăng bài tuyển dụng thành công!');
      navigate('/hr/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi lưu công việc. Vui lòng check hệ thống mạng.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page post-job-page" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>Tạo Tin Tuyển Dụng Mới</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        Điền đầy đủ thông tin bên dưới để thu hút các ứng viên sáng giá nhất hệ thống.
      </p>
      <JobForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default PostJob;
