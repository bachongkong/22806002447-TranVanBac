import { useState } from 'react'
import {
  usePendingCompanies,
  useApproveCompany,
  useRejectCompany,
  useLockCompany,
} from '../hooks/useAdmin'
import { LoadingSpinner } from '@shared/components'
import { FiCheckCircle, FiXCircle, FiLock } from 'react-icons/fi'
import './PendingCompanyList.css'

export default function PendingCompanyList() {
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, isError } = usePendingCompanies({ page, limit })
  const approveCompany = useApproveCompany()
  const rejectCompany = useRejectCompany()
  const lockCompany = useLockCompany()

  if (isLoading) {
    return (
      <div className="pending-list-loading">
        <LoadingSpinner />
        <p>Đang tải danh sách công ty...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="pending-list-error">
        <p>Có lỗi xảy ra khi tải danh sách. Vui lòng thử lại sau.</p>
      </div>
    )
  }

  const companies = data?.data || []
  const totalPages = data?.pagination?.totalPages || 1

  const handleApprove = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn duyệt công ty này?')) {
      approveCompany.mutate(id)
    }
  }

  const handleReject = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn từ chối công ty này?')) {
      rejectCompany.mutate(id)
    }
  }

  const handleLock = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn khóa công ty này vì vi phạm?')) {
      lockCompany.mutate(id)
    }
  }

  return (
    <div className="pending-company-list">
      {companies.length === 0 ? (
        <div className="empty-state">
          <h3>Không có dữ liệu</h3>
          <p>Hiện không có công ty nào đang chờ duyệt.</p>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Công ty</th>
                  <th>Website / Ngành nghề</th>
                  <th>Ngày tạo</th>
                  <th>Người kích hoạt</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company._id}>
                    <td>
                      <div className="company-info-cell">
                        <img
                          src={company.logo ? import.meta.env.VITE_API_URL?.replace('/api/v1', '') + company.logo : 'https://via.placeholder.com/40?text=Logo'}
                          alt={company.name}
                          className="table-logo"
                        />
                        <div className="company-text">
                          <span className="company-name">{company.name}</span>
                          <span className="company-location">{company.location || 'Chưa cập nhật địa chỉ'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="company-details">
                        <a href={company.website} target="_blank" rel="noreferrer" className="company-website">
                          {company.website || 'Không có website'}
                        </a>
                        <span className="company-industry">{company.industry || 'Không có ngành nghề'}</span>
                      </div>
                    </td>
                    <td>{new Date(company.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td>{company.createdBy?.email || 'N/A'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action approve"
                          onClick={() => handleApprove(company._id)}
                          title="Duyệt"
                          disabled={approveCompany.isPending}
                        >
                          <FiCheckCircle /> Duyệt
                        </button>
                        <button
                          className="btn-action reject"
                          onClick={() => handleReject(company._id)}
                          title="Từ chối"
                          disabled={rejectCompany.isPending}
                        >
                          <FiXCircle /> Từ chối
                        </button>
                        <button
                          className="btn-action lock"
                          onClick={() => handleLock(company._id)}
                          title="Khóa"
                          disabled={lockCompany.isPending}
                        >
                          <FiLock /> Khóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Trước
              </button>
              <span className="page-info">
                Trang {page} / {totalPages}
              </span>
              <button
                className="page-btn"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
