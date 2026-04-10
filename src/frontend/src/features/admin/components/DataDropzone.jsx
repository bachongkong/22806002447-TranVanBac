import React, { useCallback, useState } from 'react';

import axios from 'axios';
import { toast } from 'react-hot-toast';
import './DataDropzone.css';

const DataDropzone = ({ endpoint, label, acceptedTypes, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles?.length > 0) {
       setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedTypes || { 'text/csv': ['.csv'] },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    const toastId = toast.loading('Đang xử lý tải lên nội dung...');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      await axios.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true 
      });
      toast.success('Nhập dữ liệu thành công!', { id: toastId });
      setFile(null);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi upload file. Kiểm tra lại kết nối.', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="data-dropzone-container">
      <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>{label || "Nhập Master Data"}</h3>
      
      <div 
        {...getRootProps()} 
        className={`dropzone-area ${isDragActive ? 'active' : ''} ${isDragReject ? 'reject' : ''}`}
      >
        <input {...getInputProps()} />
        {
          file ? (
            <div className="file-selected">
              
              <p className="file-name">{file.name}</p>
              <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          ) : (
            <div className="dropzone-placeholder">
              <FiUploadCloud size={48} className="icon-gray" />
              {
                isDragActive ?
                  <p>Thả file vào đây ...</p> :
                  <p>Kéo thả file CSV vào đây, hoặc <span className="highlight">Nhấp để chọn file</span></p>
              }
              <p className="dropzone-hint">Chỉ hỗ trợ file định dạng .csv</p>
            </div>
          )
        }
      </div>

      {file && (
        <div className="actions">
          <button className="btn btn--outline" onClick={() => setFile(null)} disabled={isUploading}>
            Hủy Bỏ
          </button>
          <button className="btn btn--primary" onClick={handleUpload} disabled={isUploading}>
             {isUploading ? 'Hệ thống đang xử lý...' : 'Xác nhận Upload'}
          </button>
        </div>
      )}
    </div>
  );
};

export default DataDropzone;
