import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import cvService from '../services/cvService'

export const CV_KEYS = {
  all: ['cvs'],
  lists: () => [...CV_KEYS.all, 'list'],
}

// ------------------------------------
// Queries
// ------------------------------------

export const useGetMyCvs = () => {
  return useQuery({
    queryKey: CV_KEYS.lists(),
    queryFn: async () => {
      const response = await cvService.getMyCvs()
      return response.data?.data || []
    },
  })
}

// ------------------------------------
// Mutations
// ------------------------------------

export const useParseOcrCv = () => {
  return useMutation({
    mutationFn: (file) => {
      const formData = new FormData()
      formData.append('file', file)
      return cvService.parseOcrPreview(formData)
    },
    onSuccess: (response) => {
      toast.success('Bóc tách thông tin từ file thành công')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi trích xuất hoặc định dạng file không hỗ trợ.')
    },
  })
}

export const useUploadCv = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ file, title }) => {
      const formData = new FormData()
      formData.append('file', file)
      if (title) formData.append('title', title)
      return cvService.uploadCv(formData)
    },
    onSuccess: (response) => {
      toast.success('Lưu file CV thành công')
      queryClient.invalidateQueries({ queryKey: CV_KEYS.lists() })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi khi lưu file')
    },
  })
}

export const useCreateOnlineCv = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => cvService.createOnlineCv(data),
    onSuccess: () => {
      toast.success('Tạo CV Online thành công')
      queryClient.invalidateQueries({ queryKey: CV_KEYS.lists() })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Tạo CV thất bại.')
    },
  })
}

export const useUpdateOnlineCv = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => cvService.updateOnlineCv(id, data),
    onSuccess: () => {
      toast.success('Cập nhật CV thành công')
      queryClient.invalidateQueries({ queryKey: CV_KEYS.lists() })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Cập nhật thất bại.')
    },
  })
}

export const useSetDefaultCv = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => cvService.setDefault(id),
    onSuccess: () => {
      toast.success('Thay đổi CV mặc định thành công')
      queryClient.invalidateQueries({ queryKey: CV_KEYS.lists() })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi set default.')
    },
  })
}

export const useDeleteCv = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => cvService.deleteCv(id),
    onSuccess: () => {
      toast.success('Đã xóa CV')
      queryClient.invalidateQueries({ queryKey: CV_KEYS.lists() })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Xóa CV thất bại.')
    },
  })
}
