import { Outlet, Link } from 'react-router-dom'
import useAuthStore from '@app/store/authStore'
import { useLogout } from '@features/auth'
import './MainLayout.css'

/**
 * MainLayout — Layout cho trang public (Landing, Login, Register)
 */
export default function MainLayout() {
  const { isAuthenticated, user } = useAuthStore()
  const { mutate: logout, isPending: isLoggingOut } = useLogout()

  const handleLogout = (e) => {
    e.preventDefault()
    logout()
  }

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'candidate': return '/candidate/dashboard'
      case 'hr': return '/hr/dashboard'
      case 'admin': return '/admin/dashboard'
      default: return '/'
    }
  }

  return (
    <div className="main-layout">
      <header className="main-header">
        <div className="main-header__container">
          <Link to="/" className="main-header__logo">
            <span className="logo-text">SmartHire</span>
          </Link>
          <nav className="main-header__nav">
            <Link to="/jobs">Việc làm</Link>
            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()}>Dashboard</Link>
                <button
                  onClick={handleLogout}
                  className="btn btn--outline"
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? 'Đang xử lý...' : 'Đăng xuất'}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn--outline">Đăng nhập</Link>
                <Link to="/register" className="btn btn--primary">Đăng ký</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="main-footer">
        <p>© 2026 SmartHire. All rights reserved.</p>
      </footer>
    </div>
  )
}
