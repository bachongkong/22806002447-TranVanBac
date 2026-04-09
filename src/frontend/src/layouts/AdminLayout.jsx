import { Outlet, NavLink, useNavigate } from 'react-router-dom'

import { NotificationBell } from '@shared/components'
import useAuthStore from '@app/store/authStore'
import useUIStore from '@app/store/uiStore'
import { useLogout } from '@features/auth'
import './DashboardLayout.css'

const adminMenu = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/companies', label: 'Duyệt Company' },
  { to: '/admin/settings', label: 'Cài đặt hệ thống' },
]

/**
 * AdminLayout — Sidebar layout cho admin panel
 */
export default function AdminLayout() {
  const { user } = useAuthStore()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const { mutate: logoutAPI, isPending: isLoggingOut } = useLogout()
  const navigate = useNavigate()

  const handleLogout = () => {
    if (!isLoggingOut) logoutAPI()
  }

  return (
    <div className={`dashboard-layout ${sidebarOpen ? '' : 'dashboard-layout--collapsed'}`}>
      <aside className="dashboard-sidebar dashboard-sidebar--admin">
        <div className="sidebar-header">
          <a href="/" className="sidebar-logo">

            {sidebarOpen && <span className="logo-text">Admin Panel</span>}
          </a>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            ☰
          </button>
        </div>

        <nav className="sidebar-nav">
          {adminMenu.map(({ to, label }) => (
            <NavLink key={to} to={to} className="sidebar-link">
              <span className="sidebar-link__icon" style={{ fontWeight: '600', fontSize: '1.2rem' }}>{label.charAt(0)}</span>
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user__avatar sidebar-user__avatar--admin">
              {user?.profile?.fullName?.charAt(0) || 'A'}
            </div>
            {sidebarOpen && (
              <div className="sidebar-user__info">
                <p className="sidebar-user__name">{user?.profile?.fullName || 'Admin'}</p>
                <p className="sidebar-user__role">Administrator</p>
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
          <NotificationBell onClick={() => navigate('/admin/notifications')} />
        </header>
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
