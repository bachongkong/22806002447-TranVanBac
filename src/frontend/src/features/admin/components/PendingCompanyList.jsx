import { useState } from 'react'
import { FiCheckCircle, FiLock, FiXCircle } from 'react-icons/fi'

import { LoadingSpinner } from '@shared/components'
import { resolveAssetUrl } from '@shared/utils'

import {
  useApproveCompany,
  useLockCompany,
  usePendingCompanies,
  useRejectCompany,
} from '../hooks/useAdmin'

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
        <p>Äang táº£i danh sÃ¡ch cÃ´ng ty...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="pending-list-error">
        <p>CÃ³ lá»—i xáº£y ra khi táº£i danh sÃ¡ch. Vui lÃ²ng thá»­ láº¡i sau.</p>
      </div>
    )
  }

  const companies = data?.data || []
  const totalPages = data?.meta?.totalPages || 1

  const handleApprove = (id) => {
    if (window.confirm('Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n duyá»‡t cÃ´ng ty nÃ y?')) {
      approveCompany.mutate(id)
    }
  }

  const handleReject = (id) => {
    if (window.confirm('Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n tá»« chá»‘i cÃ´ng ty nÃ y?')) {
      rejectCompany.mutate(id)
    }
  }

  const handleLock = (id) => {
    if (window.confirm('Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n khÃ³a cÃ´ng ty nÃ y vÃ¬ vi pháº¡m?')) {
      lockCompany.mutate(id)
    }
  }

  return (
    <div className="pending-company-list">
      {companies.length === 0 ? (
        <div className="empty-state">
          <h3>KhÃ´ng cÃ³ dá»¯ liá»‡u</h3>
          <p>Hiá»‡n khÃ´ng cÃ³ cÃ´ng ty nÃ o Ä‘ang chá» duyá»‡t.</p>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>CÃ´ng ty</th>
                  <th>Website / NgÃ nh nghá»</th>
                  <th>NgÃ y táº¡o</th>
                  <th>NgÆ°á»i kÃ­ch hoáº¡t</th>
                  <th>HÃ nh Ä‘á»™ng</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company._id}>
                    <td>
                      <div className="company-info-cell">
                        <img
                          src={resolveAssetUrl(company.logo) || 'https://via.placeholder.com/40?text=Logo'}
                          alt={company.name}
                          className="table-logo"
                        />
                        <div className="company-text">
                          <span className="company-name">{company.name}</span>
                          <span className="company-location">
                            {company.location || 'ChÆ°a cáº­p nháº­t Ä‘á»‹a chá»‰'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="company-details">
                        {company.website ? (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noreferrer"
                            className="company-website"
                          >
                            {company.website}
                          </a>
                        ) : (
                          <span className="company-website">KhÃ´ng cÃ³ website</span>
                        )}
                        <span className="company-industry">
                          {company.industry || 'KhÃ´ng cÃ³ ngÃ nh nghá»'}
                        </span>
                      </div>
                    </td>
                    <td>{new Date(company.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td>{company.createdBy?.email || 'N/A'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action approve"
                          onClick={() => handleApprove(company._id)}
                          title="Duyá»‡t"
                          disabled={approveCompany.isPending}
                        >
                          <FiCheckCircle /> Duyá»‡t
                        </button>
                        <button
                          className="btn-action reject"
                          onClick={() => handleReject(company._id)}
                          title="Tá»« chá»‘i"
                          disabled={rejectCompany.isPending}
                        >
                          <FiXCircle /> Tá»« chá»‘i
                        </button>
                        <button
                          className="btn-action lock"
                          onClick={() => handleLock(company._id)}
                          title="KhÃ³a"
                          disabled={lockCompany.isPending}
                        >
                          <FiLock /> KhÃ³a
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
                onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                disabled={page === 1}
              >
                TrÆ°á»›c
              </button>
              <span className="page-info">
                Trang {page} / {totalPages}
              </span>
              <button
                className="page-btn"
                onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
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
