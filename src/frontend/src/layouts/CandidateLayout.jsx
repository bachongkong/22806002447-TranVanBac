import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { HiOutlineBriefcase, HiOutlineDocumentText, HiOutlineHeart, HiOutlineBell, HiOutlineChatBubbleLeftRight, HiOutlineUser, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2'
import { NotificationBell } from '@shared/components'
import useAuthStore from '@app/store/authStore'
import useUIStore from '@app/store/uiStore'
import { useLogout } from '@features/auth'
import './DashboardLayout.css'

const candidateMenu = [
  { to: '/candidate/dashboard', icon: HiOutlineBriefcase, label: 'Dashboard' },
  { to: '/candidate/my-applications', icon: HiOutlineDocumentText, label: 'Đơn ứng tuyển' },
  { to: '/candidate/saved-jobs', icon: HiOutlineHeart, label: 'Việc đã lưu' },
  { to: '/candidate/my-cvs', icon: HiOutlineDocumentText, label: 'CV của tôi' },
  { to: '/candidate/profile', icon: HiOutlineUser, label: 'Hồ sơ' },
  { to: '/candidate/notifications', icon: HiOutlineBell, label: 'Thông báo' },
  { to: '/candidate/messages', icon: HiOutlineChatBubbleLeftRight, label: 'Tin nhắn' },
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
            <span className="logo-icon">💼</span>
            {sidebarOpen && <span className="logo-text">SmartHire</span>}
          </a>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            ☰
          </button>
        </div>

        <nav className="sidebar-nav">
          {candidateMenu.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className="sidebar-link">
              <Icon className="sidebar-link__icon" />
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
            <HiOutlineArrowRightOnRectangle />
            {sidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header-top">
          <NotificationBell onClick={() => navigate('/candidate/notifications')} />
        </header>
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
