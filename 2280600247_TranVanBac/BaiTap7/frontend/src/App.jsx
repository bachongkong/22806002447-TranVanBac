import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import TicketValidation from './pages/TicketValidation'
import ManualInspection from './pages/ManualInspection'
import AdminUsers from './pages/AdminUsers'
import PerformanceLab from './pages/PerformanceLab'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Notification from './components/Notification'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route
              path="metro/validate"
              element={
                <ProtectedRoute allowedRoles={['staff', 'admin']}>
                  <TicketValidation />
                </ProtectedRoute>
              }
            />
            <Route
              path="metro/inspection"
              element={
                <ProtectedRoute allowedRoles={['inspector', 'admin']}>
                  <ManualInspection />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="performance/lab"
              element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <PerformanceLab />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <Notification />
    </AuthProvider>
  )
}

export default App
