import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import JobForm from '../../features/jobs/components/JobForm';
import axios from 'axios';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`/api/jobs/${id}`, { withCredentials: true });
        // Assume API standard wrapper { success: true, data: { ...job } }
        setInitialData(res.data.data || res.data);
      } catch (err) {
        console.error(err);
        toast.error('Không tìm thấy tin tuyển dụng hoặc không có quyền truy cập.');
        navigate('/hr/jobs');
      } finally {
        setIsFetching(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      await axios.put(`/api/jobs/${id}`, data, { withCredentials: true });
      toast.success('Cập nhật thông tin tuyển dụng thành công!');
      navigate('/hr/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi cập nhật. Hãy thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div className="page" style={{ textAlign: 'center', marginTop: '4rem' }}>Đang tải dữ liệu...</div>;

  return (
    <div className="page edit-job-page" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>Chỉnh Sửa Tin Tuyển Dụng</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        Cập nhật lại các thông tin của tin tuyển dụng để phù hợp với định hướng mới của công ty.
      </p>
      <JobForm initialValues={initialData} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default EditJob;
