import { UploadCvOcr } from '@features/cvs/components'
import './CvManagerPage.css'

export default function CvManagerPage() {
  return (
    <div className="cv-manager-page fade-in">
      <div className="page-header">
        <h1 className="page-title">Quản lý Hồ sơ CV</h1>
        <p className="page-subtitle">
          Tải lên file PDF hoặc word CV của bạn, hệ thống AI sẽ tự động phân tích và tạo hồ sơ trực tuyến trong vòng vài giây.
        </p>
      </div>

      <div className="cv-content">
        <UploadCvOcr />
        
        {/* Placeholder: Tương lai có thế chèn thêm components như List My Cvs ở đây */}
      </div>
    </div>
  )
}
