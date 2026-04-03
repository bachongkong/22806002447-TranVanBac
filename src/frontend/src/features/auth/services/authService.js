// ============================================
// Feature: Auth
// ============================================
// API service cho auth: login, register, logout, refresh...
import { apiClient, API } from '@shared/services'

const authService = {
  register: (data) => apiClient.post(API.AUTH.REGISTER, data),
  login: (data) => apiClient.post(API.AUTH.LOGIN, data),
  logout: () => apiClient.post(API.AUTH.LOGOUT),
  refreshToken: () => apiClient.post(API.AUTH.REFRESH_TOKEN),
  forgotPassword: (data) => apiClient.post(API.AUTH.FORGOT_PASSWORD, data),
  resetPassword: (data) => apiClient.post(API.AUTH.RESET_PASSWORD, data),
  verifyEmail: (token) => apiClient.get(`${API.AUTH.VERIFY_EMAIL}?token=${token}`),
  resendVerification: (data) => apiClient.post(API.AUTH.RESEND_VERIFICATION, data),
  getMe: () => apiClient.get(API.AUTH.ME),
}

export default authService
