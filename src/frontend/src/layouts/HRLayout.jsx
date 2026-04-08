import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { HiOutlineChartBarSquare, HiOutlineBriefcase, HiOutlineUserGroup, HiOutlineBuildingOffice2, HiOutlineCalendarDays, HiOutlineBell, HiOutlineChatBubbleLeftRight, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2'
import { NotificationBell } from '@shared/components'
import useAuthStore from '@app/store/authStore'
import useUIStore from '@app/store/uiStore'
import { useLogout } from '@features/auth'
import { ChatBadge, ChatWindow } from '@features/chat'
import './DashboardLayout.css'

const hrMenu = [
  { to: '/hr/dashboard', icon: HiOutlineChartBarSquare, label: 'Dashboard' },
  { to: '/hr/jobs', icon: HiOutlineBriefcase, label: 'Tin tuyển dụng' },
  { to: '/hr/applications', icon: HiOutlineUserGroup, label: 'Ứng viên' },
  { to: '/hr/interviews', icon: HiOutlineCalendarDays, label: 'Lịch phỏng vấn' },
  { to: '/hr/company', icon: HiOutlineBuildingOffice2, label: 'Công ty' },
  { to: '/hr/notifications', icon: HiOutlineBell, label: 'Thông báo' },
  { to: '/hr/messages', icon: HiOutlineChatBubbleLeftRight, label: 'Tin nhắn' },
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
            <span className="logo-icon">💼</span>
            {sidebarOpen && <span className="logo-text">SmartHire</span>}
          </a>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            ☰
          </button>
        </div>

        <nav className="sidebar-nav">
          {hrMenu.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className="sidebar-link">
              <Icon className="sidebar-link__icon" />
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
            <HiOutlineArrowRightOnRectangle />
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
