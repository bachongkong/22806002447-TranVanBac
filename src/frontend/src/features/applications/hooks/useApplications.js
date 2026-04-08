import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import applicationService from '../services/applicationService'

export const APP_KEYS = {
  all: ['applications'],
  byJob: (jobId) => [...APP_KEYS.all, 'by-job', jobId],
}

/**
 * useApplicationsByJob — Lấy danh sách ứng viên theo job cho HR
 */
export function useApplicationsByJob(jobId) {
  return useQuery({
    queryKey: APP_KEYS.byJob(jobId),
    queryFn: async () => {
      const response = await applicationService.getByJob(jobId)
      return response.data
    },
    enabled: !!jobId,
  })
}

/**
 * useUpdateApplicationStatus — Mutation đổi status với optimistic update
 */
export function useUpdateApplicationStatus(jobId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ applicationId, status, note }) =>
      applicationService.updateStatus(applicationId, { status, note }),

    // Optimistic update: di chuyển card ngay trước khi server trả về
    onMutate: async ({ applicationId, status }) => {
      await queryClient.cancelQueries({ queryKey: APP_KEYS.byJob(jobId) })

      const previousData = queryClient.getQueryData(APP_KEYS.byJob(jobId))

      queryClient.setQueryData(APP_KEYS.byJob(jobId), (old) => {
        if (!old?.data) return old
        return {
          ...old,
          data: old.data.map((app) =>
            app._id === applicationId ? { ...app, status } : app
          ),
        }
      })

      return { previousData }
    },

    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(APP_KEYS.byJob(jobId), context.previousData)
      }
      const message = error.response?.data?.message || 'Không thể cập nhật trạng thái'
      toast.error(message)
    },

    onSuccess: () => {
      toast.success('Cập nhật trạng thái thành công')
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: APP_KEYS.byJob(jobId) })
    },
  })
}
