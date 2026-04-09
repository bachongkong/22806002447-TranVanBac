import React, { useState } from 'react';
import DataDropzone from '../../features/admin/components/DataDropzone';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const SystemSettingsPage = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportUsers = async () => {
    setIsExporting(true);
    const toastId = toast.loading('Đang khởi tạo luồng giải nén dữ liệu qua Buffer Stream...');
    
    try {
      // FORCE responseType: blob to natively stream massive network packets directly into RAM buffer 
      const response = await axios.get('/api/admin/users/export', {
        withCredentials: true,
        responseType: 'blob' 
      });

      // Browser native Blob URL constructor
      const blob = new Blob([response.data], { type: 'text/csv' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      const dateStr = new Date().toISOString().split('T')[0];
      link.download = `users_export_${dateStr}.csv`;
      
      // Inject to DOM, Click, and instantly destroy references isolating Garbage Collection
      document.body.appendChild(link);
      link.click();
      
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      
      toast.success('Dữ liệu Cập nhật & Tải Xuống thành công!', { id: toastId });
    } catch (err) {
      console.error('Export Data Error:', err);
      // Blind decoding because Blob responses mask standard JSON error messages
      toast.error('Có lỗi xảy ra trong quá trình xuất dữ liệu API.', { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="page" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Trạm Quản Trị Hệ Thống (Master Data)</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem' }}>
        Công cụ nhập/xuất báo cáo và xử lý Master Data số lượng lớn chuyên dụng, ngăn chặn sập tài nguyên phía Backend.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Import Region */}
        <section>
          <div style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Tải lên CSDL (Import System Configs)</h2>
            <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem', maxWidth: '800px' }}>Hỗ trợ cập nhật hàng rào Master Data (Category/Tagging) bằng file gốc tiêu chuẩn. Hệ thống tự động validation dữ liệu rác trước khi Commit.</p>
          </div>
          <DataDropzone 
            endpoint="/api/admin/master-data/import" 
            label="Import file nguồn (.csv)"
            acceptedTypes={{ 'text/csv': ['.csv'] }}
            onUploadSuccess={() => { /* Optionally refresh tables here */ }}
          />
        </section>

        {/* Separator Divider */}
        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

        {/* Export Region */}
        <section>
          <div style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Trích xuất CSDL (Streaming Exports)</h2>
            <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem', maxWidth: '800px' }}>Xuất trọn bộ hệ thống người dùng. Quá trình diễn ra hoàn toàn tự động thông qua giao thức luồng Stream Buffer, triệt tiêu tối đa rủi ro giật hay vỡ Runtime Memory khi Data đạt mốc hàng triệu Records.</p>
          </div>
          
          <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Dataset Backup Trực Tuyến</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Mảng Users (Đầy đủ thuộc tính Email, Status, Role, Timestamps).</p>
            </div>
            <button 
              onClick={handleExportUsers} 
              disabled={isExporting} 
              className="btn btn--primary" 
              style={{ display: 'flex', gap: '8px', alignItems: 'center', minWidth: '160px', justifyContent: 'center' }}
            >
              
              {isExporting ? 'Đang Ép Luồng...' : 'Export File CSV'}
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default SystemSettingsPage;
