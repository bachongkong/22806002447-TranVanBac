import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import jobService from '../services/jobService'

// ============================================
// Queries
// ============================================

/**
 * HR lấy danh sách jobs của mình
 */
export function useMyJobs(params) {
  return useQuery({
    queryKey: ['my-jobs', params],
    queryFn: () => jobService.getMyJobs(params).then(res => res.data),
    staleTime: 2 * 60 * 1000,
  })
}

/**
 * Lấy chi tiết 1 job
 */
export function useJob(id) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => jobService.getById(id).then(res => res.data),
    enabled: !!id,
  })
}

// ============================================
// Mutations
// ============================================

/**
 * Tạo job mới (status = draft)
 */
export function useCreateJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => jobService.create(data),
    onSuccess: () => {
      toast.success('Tạo tin tuyển dụng thành công!')
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Không thể tạo tin tuyển dụng')
    },
  })
}

/**
 * Cập nhật job (chỉ khi draft)
 */
export function useUpdateJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => jobService.update(id, data),
    onSuccess: (_, { id }) => {
      toast.success('Cập nhật tin tuyển dụng thành công!')
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] })
      queryClient.invalidateQueries({ queryKey: ['job', id] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Không thể cập nhật tin tuyển dụng')
    },
  })
}

/**
 * Xóa job (chỉ khi draft)
 */
export function useDeleteJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => jobService.delete(id),
    onSuccess: () => {
      toast.success('Xóa tin tuyển dụng thành công!')
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Không thể xóa tin tuyển dụng')
    },
  })
}

/**
 * Chuyển trạng thái job (draft→pending, published→closed, etc.)
 */
export function useUpdateJobStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }) => jobService.updateStatus(id, status),
    onSuccess: (res) => {
      toast.success(res.data?.message || 'Chuyển trạng thái thành công!')
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Không thể chuyển trạng thái')
    },
  })
}
