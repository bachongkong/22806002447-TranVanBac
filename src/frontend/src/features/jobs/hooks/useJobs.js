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

/**
 * Toggle lưu việc làm (Candidate)
 * Sử dụng optimistic update pattern
 */
export function useToggleFavoriteJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => jobService.toggleFavorite(id),
    onMutate: async (id) => {
      // Hủy các query đang fetch để tránh ghi đè dữ liệu cache
      await queryClient.cancelQueries({ queryKey: ['favorites'] })
      await queryClient.cancelQueries({ queryKey: ['job', id] })
      await queryClient.cancelQueries({ queryKey: ['jobs'] })

      // Lưu trữ trạng thái cũ dể rollback nếu có lỗi
      const previousJob = queryClient.getQueryData(['job', id])

      // 1. Optimistic Update cho trang Chi tiết Job
      if (previousJob) {
        queryClient.setQueryData(['job', id], {
          ...previousJob,
          isSaved: !previousJob.isSaved,
        })
      }

      // 2. Optimistic Update cho các list jobs (nếu đang ở trang danh sách)
      queryClient.setQueriesData({ queryKey: ['jobs'] }, (oldData) => {
        if (!oldData) return oldData
        
        // Dành cho list jobs bình thường
        if (oldData.data && Array.isArray(oldData.data)) {
          return {
            ...oldData,
            data: oldData.data.map((job) =>
              job._id === id ? { ...job, isSaved: !job.isSaved } : job
            ),
          }
        }
        
        // Dành cho list jobs dạng Infinite Scroll (nếu có)
        if (oldData.pages) {
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data?.map((job) =>
                job._id === id ? { ...job, isSaved: !job.isSaved } : job
              ),
            })),
          }
        }
        return oldData
      })

      return { previousJob }
    },
    onError: (error, id, context) => {
      // Rollback data nếu call API thất bại
      if (context?.previousJob) {
        queryClient.setQueryData(['job', id], context.previousJob)
      }
      // Reload lại danh sách cho đồng bộ
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu tin tuyển dụng')
    },
    onSettled: (data, error, id) => {
      // Sau khi request hoàn tất (thành công hay thất bại), trigger refetch để đảm bảo data chuẩn xác 100%
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      queryClient.invalidateQueries({ queryKey: ['job', id] })
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}
