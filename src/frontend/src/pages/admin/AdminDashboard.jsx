import { Suspense, lazy } from 'react'

import { useDashboardStats } from '@features/admin/hooks/useAdmin'

const UsersChart = lazy(() => import('@features/dashboard/components/UsersChart'))
const JobsChart = lazy(() => import('@features/dashboard/components/JobsChart'))

const ChartSkeleton = () => (
  <div
    style={{
      width: '100%',
      height: 300,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-surface-2)',
      borderRadius: '8px',
    }}
  >
    <span style={{ color: 'var(--color-text-muted)' }}>
      Äang táº£i biá»ƒu Ä‘á»“ phÃ¢n tÃ­ch...
    </span>
  </div>
)

export default function AdminDashboard() {
  const { data: stats, isLoading, isError } = useDashboardStats()

  if (isLoading) {
    return <div className="page" style={{ padding: '2rem' }}>Äang náº¡p phÃ¢n tÃ­ch...</div>
  }

  if (isError) {
    return <div className="page" style={{ padding: '2rem' }}>KhÃ´ng táº£i Ä‘Æ°á»£c dá»¯ liá»‡u dashboard.</div>
  }

  if (!stats?.overview) {
    return <div className="page" style={{ padding: '2rem' }}>KhÃ´ng cÃ³ dá»¯ liá»‡u bÃ¡o cÃ¡o há»‡ thá»‘ng.</div>
  }

  return (
    <div
      className="page admin-dashboard"
      style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}
    >
      <h1 style={{ marginBottom: '2rem' }}>Biá»ƒu Äá»“ Tá»•ng Quan Há»‡ Thá»‘ng</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
        }}
      >
        <div
          style={{
            background: 'var(--color-surface)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
          }}
        >
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 600 }}>
            Tá»· Lá»‡ PhÃ¢n Bá»‘ NgÆ°á»i DÃ¹ng
          </h2>
          <Suspense fallback={<ChartSkeleton />}>
            <UsersChart data={stats.overview.users} />
          </Suspense>
        </div>

        <div
          style={{
            background: 'var(--color-surface)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
          }}
        >
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 600 }}>
            Tráº¡ng ThÃ¡i Tuyá»ƒn Dá»¥ng
          </h2>
          <Suspense fallback={<ChartSkeleton />}>
            <JobsChart data={stats.overview.jobs} />
          </Suspense>
        </div>

        <div
          style={{
            background: 'var(--color-surface)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
          }}
        >
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 600 }}>
            Viá»‡c LÃ m Äang Chá» Duyá»‡t (Má»›i nháº¥t)
          </h2>
          {stats.recentPending?.jobs?.length > 0 ? (
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              {stats.recentPending.jobs.map((job) => (
                <li
                  key={job._id}
                  style={{
                    paddingBottom: '0.5rem',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ fontWeight: 500, color: 'var(--color-primary-light)' }}>
                    {job.title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    CÃ´ng ty: {job.companyId?.name}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--color-text-muted)' }}>
              Há»‡ thá»‘ng chÆ°a cÃ³ tin chá» duyá»‡t má»›i lÃºc nÃ y.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
