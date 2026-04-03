import { useState } from 'react'
import { OnlineCvBuilder } from '@features/cvs/components'
import './CvManagerPage.css'

export default function CvManagerPage() {
  const [activeTab, setActiveTab] = useState('upload')

import { UploadCvOcr } from '@features/cvs/components'
import './CvManagerPage.css'

export default function CvManagerPage() {
  return (
    <div className="cv-manager-page fade-in">
      <div className="page-header">
        <h1 className="page-title">Quản lý Hồ sơ CV</h1>
        <p className="page-subtitle">
          Tải lên file định dạng gốc hoặc dùng trình tạo CV trực tuyến để xây dựng profile của bạn.
        </p>
      </div>

      <div className="cv-tabs">
        <button 
          className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          Tải lên tĩnh (PDF/Word)
        </button>
        <button 
          className={`tab-btn ${activeTab === 'builder' ? 'active' : ''}`}
          onClick={() => setActiveTab('builder')}
        >
          Trình Tạo Online / OCR Review
        </button>
      </div>

      <div className="cv-content">
        {activeTab === 'upload' && (
          <div className="placeholder-card">
            <h3>Module Tải file</h3>
            <p>Sẽ được liên kết với UploadCvOcr từ Branch khác khi Merge.</p>
          </div>
        )}

        {activeTab === 'builder' && (
          <OnlineCvBuilder />
        )}
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
