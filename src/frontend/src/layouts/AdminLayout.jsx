import { Outlet, NavLink } from 'react-router-dom'
import { HiOutlineChartBarSquare, HiOutlineUsers, HiOutlineBuildingOffice2, HiOutlineBriefcase, HiOutlineTag, HiOutlineShieldCheck, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2'
import useAuthStore from '@app/store/authStore'
import useUIStore from '@app/store/uiStore'
import { useLogout } from '@features/auth'
import './DashboardLayout.css'

const adminMenu = [
  { to: '/admin/dashboard', icon: HiOutlineChartBarSquare, label: 'Dashboard' },
  { to: '/admin/users', icon: HiOutlineUsers, label: 'Quản lý User' },
  { to: '/admin/companies', icon: HiOutlineBuildingOffice2, label: 'Duyệt Company' },
  { to: '/admin/jobs', icon: HiOutlineBriefcase, label: 'Duyệt Job' },
  { to: '/admin/taxonomy', icon: HiOutlineTag, label: 'Danh mục' },
  { to: '/admin/audit-logs', icon: HiOutlineShieldCheck, label: 'Audit Log' },
]

/**
 * AdminLayout — Sidebar layout cho admin panel
 */
export default function AdminLayout() {
  const { user } = useAuthStore()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const { mutate: logoutAPI, isPending: isLoggingOut } = useLogout()

  const handleLogout = () => {
    if (!isLoggingOut) logoutAPI()
  }

  return (
    <div className={`dashboard-layout ${sidebarOpen ? '' : 'dashboard-layout--collapsed'}`}>
      <aside className="dashboard-sidebar dashboard-sidebar--admin">
        <div className="sidebar-header">
          <a href="/" className="sidebar-logo">
            <span className="logo-icon">🛡️</span>
            {sidebarOpen && <span className="logo-text">Admin Panel</span>}
          </a>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            ☰
          </button>
        </div>

        <nav className="sidebar-nav">
          {adminMenu.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className="sidebar-link">
              <Icon className="sidebar-link__icon" />
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
            <HiOutlineArrowRightOnRectangle />
            {sidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  )
}
