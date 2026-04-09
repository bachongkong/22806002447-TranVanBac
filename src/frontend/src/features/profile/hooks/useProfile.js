import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileService } from '../services/profileService'
import toast from 'react-hot-toast'
import useAuthStore from '@app/store/authStore'

export const PROFILE_QUERY_KEY = ['profile']

export function useGetProfile() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: profileService.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const updateUser = useAuthStore((state) => state.updateUser)

  return useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, data)
      updateUser(data)
      toast.success('Cap nhat thong tin thanh cong!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Co loi xay ra')
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: profileService.changePassword,
    onSuccess: () => {
      toast.success('Doi mat khau thanh cong!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Khong the doi mat khau')
    },
  })
}

export function useUploadAvatar() {
  const queryClient = useQueryClient()
  const updateUser = useAuthStore((state) => state.updateUser)

  return useMutation({
    mutationFn: profileService.uploadAvatar,
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, (old) => {
        if (!old) return old
        return {
          ...old,
          profile: {
            ...old.profile,
            avatar: data.avatar,
          },
        }
      })
      updateUser({ profile: { avatar: data.avatar } })
      toast.success('Cap nhat avatar thanh cong!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Lỗi upload ảnh')
    },
  })
}
