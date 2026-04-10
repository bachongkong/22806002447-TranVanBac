import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

import adminService from '../services/adminService'

export const ADMIN_KEYS = {
  all: ['admin'],
  companies: () => [...ADMIN_KEYS.all, 'companies'],
  pendingCompanies: (params) => [...ADMIN_KEYS.companies(), 'pending', params],
  dashboard: () => [...ADMIN_KEYS.all, 'dashboard'],
}

export const usePendingCompanies = (params) => {
  return useQuery({
    queryKey: ADMIN_KEYS.pendingCompanies(params),
    queryFn: async () => {
      const response = await adminService.getPendingCompanies(params)
      return response.data
    },
    keepPreviousData: true,
  })
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ADMIN_KEYS.dashboard(),
    queryFn: async () => {
      const response = await adminService.getDashboardStats()
      return response.data?.data
    },
  })
}

const createCompanyModerationMutation = (mutationFn, successMessage) => {
  return () => {
    const queryClient = useQueryClient()

    return useMutation({
      mutationFn,
      onSuccess: (response) => {
        toast.success(response.data?.message || successMessage)
        queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.companies() })
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'CÃ³ lá»—i xáº£y ra trong quÃ¡ trÃ¬nh xá»­ lÃ½')
      },
    })
  }
}

export const useApproveCompany = createCompanyModerationMutation(
  (id) => adminService.approveCompany(id),
  'Duyá»‡t cÃ´ng ty thÃ nh cÃ´ng'
)

export const useRejectCompany = createCompanyModerationMutation(
  (id) => adminService.rejectCompany(id),
  'Tá»« chá»‘i cÃ´ng ty thÃ nh cÃ´ng'
)

export const useLockCompany = createCompanyModerationMutation(
  (id) => adminService.lockCompany(id),
  'ÄÃ£ khÃ³a cÃ´ng ty'
)
