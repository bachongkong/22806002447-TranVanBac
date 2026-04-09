import { Outlet, NavLink, useNavigate } from 'react-router-dom'

import { NotificationBell } from '@shared/components'
import useAuthStore from '@app/store/authStore'
import useUIStore from '@app/store/uiStore'
import { useLogout } from '@features/auth'
import { ChatBadge, ChatWindow } from '@features/chat'
import './DashboardLayout.css'

const candidateMenu = [
  { to: '/candidate/dashboard', label: 'Dashboard' },
  { to: '/candidate/jobs', label: 'Tìm việc làm' },
  { to: '/candidate/applied-jobs', label: 'Việc làm đã ứng tuyển' },
  { to: '/candidate/saved-jobs', label: 'Việc làm đã lưu' },
  { to: '/candidate/cv', label: 'CV của tôi' },
  { to: '/candidate/profile', label: 'Hồ sơ' },
]

/**
 * CandidateLayout — Sidebar layout cho candidate workspace
 */
export default function CandidateLayout() {
  const { user } = useAuthStore()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const { mutate: logoutAPI, isPending: isLoggingOut } = useLogout()
  const navigate = useNavigate()

  const handleLogout = () => {
    if (!isLoggingOut) logoutAPI()
  }

  return (
    <div className={`dashboard-layout ${sidebarOpen ? '' : 'dashboard-layout--collapsed'}`}>
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <a href="/" className="sidebar-logo">

            {sidebarOpen && <span className="logo-text">SmartHire</span>}
          </a>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            ☰
          </button>
        </div>

        <nav className="sidebar-nav">
          {candidateMenu.map(({ to, label }) => (
            <NavLink key={to} to={to} className="sidebar-link">
              <span className="sidebar-link__icon" style={{ fontWeight: '600', fontSize: '1.2rem' }}>{label.charAt(0)}</span>
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user__avatar">
              {user?.profile?.fullName?.charAt(0) || 'U'}
            </div>
            {sidebarOpen && (
              <div className="sidebar-user__info">
                <p className="sidebar-user__name">{user?.profile?.fullName || 'User'}</p>
                <p className="sidebar-user__role">Candidate</p>
              </div>
            )}
          </div>
          <button className="sidebar-logout" onClick={handleLogout} title="Đăng xuất">
            <span style={{ fontWeight: '600', fontSize: '1.2rem', marginRight: sidebarOpen ? '12px' : '0' }}>Đ</span>
            {sidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header-top">
          <NotificationBell onClick={() => navigate('/candidate/notifications')} />
        </header>
        <div style={{ flex: 1, position: 'relative' }}>
          <Outlet />
          <ChatBadge />
          <ChatWindow />
        </div>
      </main>
    </div>
  )
}
