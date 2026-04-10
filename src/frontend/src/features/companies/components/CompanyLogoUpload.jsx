import { useRef } from 'react'
import { FiCamera } from 'react-icons/fi'

import { resolveAssetUrl } from '@shared/utils'

import { useUploadCompanyLogo } from '../hooks/useCompany'

import './CompanyLogoUpload.css'

export default function CompanyLogoUpload({ company }) {
  const fileInputRef = useRef(null)
  const uploadLogo = useUploadCompanyLogo()

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file || !company) return

    uploadLogo.mutate({ id: company._id, file })
  }

  const logoSrc =
    resolveAssetUrl(company?.logo) || 'https://via.placeholder.com/150?text=Logo'

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
