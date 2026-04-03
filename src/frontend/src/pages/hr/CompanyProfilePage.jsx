import { useGetMyCompany } from '@features/companies/hooks/useCompany'
import {
  CompanyLogoUpload,
  CompanyProfileForm,
  CompanyStaffManager,
} from '@features/companies/components'
import { LoadingSpinner } from '@shared/components'
import './CompanyProfilePage.css'

export default function CompanyProfilePage() {
  const { data: company, isLoading, error } = useGetMyCompany()

  if (isLoading) {
    return (
      <div className="page-loading-wrapper">
        <LoadingSpinner />
        <p>Đang tải thông tin công ty...</p>
      </div>
    )
  }

  return (
    <div className="company-profile-page fade-in">
      <div className="page-header">
        <h1 className="page-title">Hồ sơ Doanh nghiệp</h1>
        <p className="page-subtitle">
          Cập nhật thông tin công ty của bạn để thu hút ứng viên tiềm năng tốt nhất
        </p>
      </div>

      {company ? (
        <div className="profile-content">
          <div className="profile-main">
            <CompanyLogoUpload company={company} />
            <CompanyProfileForm company={company} />
          </div>
          <div className="profile-sidebar">
            <CompanyStaffManager company={company} />
          </div>
        </div>
      ) : (
        <div className="empty-company-state">
          <div className="empty-company-card">
            <h2>Chào mừng bạn!</h2>
            <p>Tài khoản của bạn chưa được liên kết với hồ sơ công ty nào. Vui lòng tạo hồ sơ doanh nghiệp để bắt đầu quá trình tuyển dụng.</p>
            <CompanyProfileForm company={null} />
          </div>
        </div>
      )}
    </div>
  )
}
