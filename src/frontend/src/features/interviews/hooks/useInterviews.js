import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import interviewService from '../services/interviewService'
import { APP_KEYS } from '@features/applications/hooks/useApplications'

export const INTERVIEW_KEYS = {
  all: ['interviews'],
  byApplication: (appId) => [...INTERVIEW_KEYS.all, 'by-app', appId],
}

/**
 * useApplicationInterviews — Lấy danh sách phỏng vấn theo application
 */
export function useApplicationInterviews(applicationId) {
  return useQuery({
    queryKey: INTERVIEW_KEYS.byApplication(applicationId),
    queryFn: async () => {
      const response = await interviewService.getByApplication(applicationId)
      return response.data
    },
    enabled: !!applicationId,
  })
}

/**
 * useScheduleInterview — Mutation tạo lịch phỏng vấn
 * Sau khi thành công: invalidate queries liên quan
 */
export function useScheduleInterview(jobId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => interviewService.create(data),

    onSuccess: () => {
      toast.success('Lên lịch phỏng vấn thành công! 📅')

      // Invalidate application list (status đã đổi → interview_scheduled)
      if (jobId) {
        queryClient.invalidateQueries({ queryKey: APP_KEYS.byJob(jobId) })
      }

      // Invalidate interview queries
      queryClient.invalidateQueries({ queryKey: INTERVIEW_KEYS.all })
    },

    onError: (error) => {
      const message = error.response?.data?.message || 'Không thể lên lịch phỏng vấn'
      toast.error(message)
    },
  })
}
