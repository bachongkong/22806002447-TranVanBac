import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import applicationService from '../services/applicationService'

/**
 * useApplyJob — Mutation hook cho ứng tuyển việc làm
 * Tự động sinh uuid v4 cho header x-idempotency-key mỗi lần submit
 */
export function useApplyJob({ onSuccess } = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ jobId, cvId, coverLetter }) => {
      const idempotencyKey = crypto.randomUUID()

      return applicationService.apply(
        { jobId, cvId, coverLetter },
        {
          headers: {
            'x-idempotency-key': idempotencyKey,
          },
        }
      )
    },
    onSuccess: (response) => {
      toast.success('Ứng tuyển thành công! 🎉')
      queryClient.invalidateQueries({ queryKey: ['my-applications'] })
      onSuccess?.(response)
    },
    onError: (error) => {
      const status = error.response?.status
      const message = error.response?.data?.message

      if (status === 409) {
        toast.error('Yêu cầu đang được xử lý, vui lòng không nhấn nhiều lần.')
      } else if (status === 400 && message?.includes('đã ứng tuyển')) {
        toast.error('Bạn đã ứng tuyển vào công việc này rồi!')
      } else {
        toast.error(message || 'Không thể ứng tuyển. Vui lòng thử lại sau.')
      }
    },
  })
}
