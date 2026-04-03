import { Routes, Route } from 'react-router-dom'
import { MainLayout, CandidateLayout, HRLayout, AdminLayout } from '@layouts'
import { ProtectedRoute, NotFound, Unauthorized } from '@shared/components'
import { ROLES } from '@shared/constants'

// --- Public Pages ---
import HomePage from '@pages/HomePage'
import LoginPage from '@pages/LoginPage'
import RegisterPage from '@pages/RegisterPage'
import JobListPage from '@pages/JobListPage'
import JobDetailPage from '@pages/JobDetailPage'

// --- Candidate Pages ---
import CandidateDashboard from '@pages/candidate/CandidateDashboard'

// --- HR Pages ---
import HRDashboard from '@pages/hr/HRDashboard'
import CompanyProfilePage from '@pages/hr/CompanyProfilePage'

// --- Admin Pages ---
import AdminDashboard from '@pages/admin/AdminDashboard'
import ManageCompaniesPage from '@pages/admin/ManageCompaniesPage'

export default function AppRouter() {
  return (
    <Routes>
      {/* ===== PUBLIC ROUTES ===== */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/jobs" element={<JobListPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      {/* ===== CANDIDATE ROUTES ===== */}
      <Route
        element={
          <ProtectedRoute allowedRoles={[ROLES.CANDIDATE]}>
            <CandidateLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        {/* Thêm candidate routes ở đây */}
      </Route>

      {/* ===== HR ROUTES ===== */}
      <Route
        element={
          <ProtectedRoute allowedRoles={[ROLES.HR]}>
            <HRLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/hr/dashboard" element={<HRDashboard />} />
        <Route path="/hr/company" element={<CompanyProfilePage />} />
        {/* Thêm HR routes ở đây */}
      </Route>

      {/* ===== ADMIN ROUTES ===== */}
      <Route
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/companies" element={<ManageCompaniesPage />} />
        {/* Thêm admin routes ở đây */}
      </Route>

      {/* ===== 404 ===== */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
