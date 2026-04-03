import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import adminService from '../services/adminService'

// Query Keys
export const ADMIN_KEYS = {
  all: ['admin'],
  companies: () => [...ADMIN_KEYS.all, 'companies'],
  pendingCompanies: (params) => [...ADMIN_KEYS.companies(), 'pending', params],
}

// ------------------------------------
// Queries
// ------------------------------------

export const usePendingCompanies = (params) => {
  return useQuery({
    queryKey: ADMIN_KEYS.pendingCompanies(params),
    queryFn: async () => {
      const response = await adminService.getPendingCompanies(params)
      return response.data
    },
    keepPreviousData: true, // Keep list visible while fetching next page
  })
}

// ------------------------------------
// Mutations
// ------------------------------------

const createCompanyModerationMutation = (mutationFn, successMessage) => {
  return () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn,
      onSuccess: (response) => {
        toast.success(response.data?.message || successMessage)
        // Invalidate pending companies list to refresh
        queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.companies() })
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra trong quá trình xử lý')
      },
    })
  }
}

export const useApproveCompany = createCompanyModerationMutation(
  (id) => adminService.approveCompany(id),
  'Duyệt công ty thành công'
)

export const useRejectCompany = createCompanyModerationMutation(
  (id) => adminService.rejectCompany(id),
  'Từ chối công ty thành công'
)

export const useLockCompany = createCompanyModerationMutation(
  (id) => adminService.lockCompany(id),
  'Đã khóa công ty'
)
