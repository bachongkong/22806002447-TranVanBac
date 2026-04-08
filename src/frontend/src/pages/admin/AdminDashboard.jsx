import React, { useEffect, useState, Suspense, lazy } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Chunk Separation: Async dynamic import lazy loading Recharts scripts
const UsersChart = lazy(() => import('../../features/dashboard/components/UsersChart'));
const JobsChart = lazy(() => import('../../features/dashboard/components/JobsChart'));

const ChartSkeleton = () => (
  <div style={{ width: '100%', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-surface-2)', borderRadius: '8px' }}>
    <span style={{ color: 'var(--color-text-muted)' }}>Đang tải biểu đồ phân tích...</span>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get('/api/admin/dashboard', { withCredentials: true });
        setStats(res.data.data || res.data);
      } catch (err) {
        toast.error('Không tải được luồng dữ liệu thống kê hệ thống.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) {
    return <div className="page" style={{ padding: '2rem' }}>Đang nạp phân tích...</div>;
  }

  if (!stats?.overview) {
    return <div className="page" style={{ padding: '2rem' }}>Không có dữ liệu báo cáo hệ thống.</div>;
  }

  return (
    <div className="page admin-dashboard" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Biểu Đồ Tổng Quan Hệ Thống</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 600 }}>Tỷ Lệ Phân Bố Người Dùng</h2>
          <Suspense fallback={<ChartSkeleton />}>
            <UsersChart data={stats.overview.users} />
          </Suspense>
        </div>

        <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 600 }}>Trạng Thái Tuyển Dụng</h2>
          <Suspense fallback={<ChartSkeleton />}>
            <JobsChart data={stats.overview.jobs} />
          </Suspense>
        </div>

        <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 600 }}>Việc Làm Đang Chờ Duyệt (Mới nhất)</h2>
          {stats.recentPending?.jobs?.length > 0 ? (
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {stats.recentPending.jobs.map(job => (
                <li key={job._id} style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ fontWeight: 500, color: 'var(--color-primary-light)' }}>{job.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Công ty: {job.companyId?.name}</div>
                </li>
              ))}
            </ul>
          ) : (
             <p style={{ color: 'var(--color-text-muted)' }}>Hệ thống chưa có tin chờ duyệt mới lúc này.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
