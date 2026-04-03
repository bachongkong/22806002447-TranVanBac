import { useRef } from 'react'
import { FiCamera } from 'react-icons/fi'
import { useUploadCompanyLogo } from '../hooks/useCompany'
import './CompanyLogoUpload.css'

export default function CompanyLogoUpload({ company }) {
  const fileInputRef = useRef(null)
  const uploadLogo = useUploadCompanyLogo()

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!company) return // Should not happen if this component is rendered

    uploadLogo.mutate({ id: company._id, file })
  }

  const logoSrc = company?.logo
    ? import.meta.env.VITE_API_URL?.replace('/api/v1', '') + company.logo
    : 'https://via.placeholder.com/150?text=Logo' // fallback

  return (
    <div className="company-logo-upload-container">
      <div className="logo-wrapper">
        <img src={logoSrc} alt="Company Logo" className="logo-image" />
        <div 
          className="logo-overlay" 
          onClick={() => fileInputRef.current?.click()}
        >
          <FiCamera className="camera-icon" />
          <span>Đổi Logo</span>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        hidden
      />
      
      <div className="logo-info">
        <h3>{company?.name || 'Tên công ty'}</h3>
        <span className={`status-badge ${company?.status}`}>
          {company?.status?.toUpperCase()}
        </span>
      </div>
    </div>
  )
}
