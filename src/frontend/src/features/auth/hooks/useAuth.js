import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import useAuthStore from '@app/store/authStore'
import authService from '../services/authService'

export function useLogin() {
  const navigate = useNavigate()
  const { setCredentials } = useAuthStore()

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await authService.login(credentials)
      return response.data // JSON response body
    },
    onSuccess: (body) => {
      const { user, accessToken } = body.data // Actual payload from ApiResponse
      
      setCredentials({ user, accessToken })
      toast.success('Đăng nhập thành công!')
      
      // Redirect based on role
      switch (user.role) {
        case 'candidate':
          navigate('/candidate/dashboard')
          break
        case 'hr':
          navigate('/hr/dashboard')
          break
        case 'admin':
          navigate('/admin/dashboard')
          break
        default:
          navigate('/')
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại!')
    }
  })
}

export function useRegister() {
  const navigate = useNavigate()
  const { setCredentials } = useAuthStore()

  return useMutation({
    mutationFn: async (data) => {
      const response = await authService.register(data)
      return response.data
    },
    onSuccess: (body) => {
      const { user, accessToken } = body.data
      
      setCredentials({ user, accessToken })
      toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực.')
      
      // Redirect to email verification pending page
      navigate('/verify-email-pending')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại!')
    }
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (data) => {
      const response = await authService.forgotPassword(data)
      return response.data
    },
    onSuccess: (body) => {
      toast.success(body.message || 'Vui lòng kiểm tra email để đặt lại mật khẩu.')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra!')
    }
  })
}

export function useResetPassword() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (data) => {
      const response = await authService.resetPassword(data)
      return response.data
    },
    onSuccess: (body) => {
      toast.success(body.message || 'Đặt lại mật khẩu thành công!')
      navigate('/login')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra!')
    }
  })
}

export function useLogout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { logout } = useAuthStore()

  return useMutation({
    mutationFn: async () => {
      const response = await authService.logout()
      return response.data
    },
    onSuccess: () => {
      logout() // Clear Zustand state
      queryClient.clear() // Clear all API cache
      toast.success('Đăng xuất thành công!')
      navigate('/login')
    },
    onError: () => {
      // Even if API fails (e.g. token expired), we still want to clear client session
      logout()
      queryClient.clear()
      navigate('/login')
    }
  })
}
