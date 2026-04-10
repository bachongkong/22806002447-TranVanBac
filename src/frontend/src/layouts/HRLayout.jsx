import { Outlet, NavLink, useNavigate } from 'react-router-dom'

import { NotificationBell } from '@shared/components'
import useAuthStore from '@app/store/authStore'
import useUIStore from '@app/store/uiStore'
import { useLogout } from '@features/auth'
import { ChatBadge, ChatWindow } from '@features/chat'
import './DashboardLayout.css'

const hrMenu = [
  { to: '/hr/dashboard', label: 'Dashboard' },
  { to: '/hr/jobs', label: 'Tin tuyển dụng' },
  { to: '/hr/candidates', label: 'Quản lý ứng viên' },
  { to: '/hr/search-cv', label: 'Tìm kiếm CV' },
  { to: '/hr/company', label: 'Công ty' },
  { to: '/hr/profile', label: 'Hồ sơ' },
]

/**
 * HRLayout — Sidebar layout cho HR workspace
 */
export default function HRLayout() {
  const { user } = useAuthStore()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const { mutate: logoutAPI, isPending: isLoggingOut } = useLogout()
  const navigate = useNavigate()

  const handleLogout = () => {
    if (!isLoggingOut) logoutAPI()
  }

  return (
    <div className={`dashboard-layout ${sidebarOpen ? '' : 'dashboard-layout--collapsed'}`}>
      <aside className="dashboard-sidebar dashboard-sidebar--hr">
        <div className="sidebar-header">
          <a href="/" className="sidebar-logo">

            {sidebarOpen && <span className="logo-text">SmartHire</span>}
          </a>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            ☰
          </button>
        </div>

        <nav className="sidebar-nav">
          {hrMenu.map(({ to, label }) => (
            <NavLink key={to} to={to} className="sidebar-link">
              <span className="sidebar-link__icon" style={{ fontWeight: '600', fontSize: '1.2rem' }}>{label.charAt(0)}</span>
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user__avatar sidebar-user__avatar--hr">
              {user?.profile?.fullName?.charAt(0) || 'H'}
            </div>
            {sidebarOpen && (
              <div className="sidebar-user__info">
                <p className="sidebar-user__name">{user?.profile?.fullName || 'HR User'}</p>
                <p className="sidebar-user__role">HR Manager</p>
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
          <NotificationBell onClick={() => navigate('/hr/notifications')} />
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
