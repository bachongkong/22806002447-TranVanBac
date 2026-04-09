import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

import companyService from '../services/companyService'

export const COMPANY_KEYS = {
  all: ['companies'],
  lists: () => [...COMPANY_KEYS.all, 'list'],
  list: (filters) => [...COMPANY_KEYS.lists(), { filters }],
  details: () => [...COMPANY_KEYS.all, 'detail'],
  detail: (id) => [...COMPANY_KEYS.details(), id],
  myCompany: () => [...COMPANY_KEYS.all, 'my-company'],
  members: (id) => [...COMPANY_KEYS.detail(id), 'members'],
}

export const useGetMyCompany = () => {
  return useQuery({
    queryKey: COMPANY_KEYS.myCompany(),
    queryFn: async () => {
      try {
        const response = await companyService.getMyCompany()
        return response.data?.data
      } catch (error) {
        if (error.response?.status === 404) {
          return null
        }

        throw error
      }
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateCompany = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => companyService.create(data),
    onSuccess: (response) => {
      toast.success(response.data?.message || 'Táº¡o cÃ´ng ty thÃ nh cÃ´ng')
      queryClient.invalidateQueries({ queryKey: COMPANY_KEYS.myCompany() })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'CÃ³ lá»—i xáº£y ra khi táº¡o cÃ´ng ty')
    },
  })
}

export const useUpdateCompany = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => companyService.update(id, data),
    onSuccess: (response) => {
      toast.success(response.data?.message || 'Cáº­p nháº­t thÃ nh cÃ´ng')
      queryClient.invalidateQueries({ queryKey: COMPANY_KEYS.myCompany() })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'CÃ³ lá»—i xáº£y ra khi cáº­p nháº­t')
    },
  })
}

export const useUploadCompanyLogo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, file }) => {
      const formData = new FormData()
      formData.append('logo', file)
      return companyService.uploadLogo(id, formData)
    },
    onSuccess: (response) => {
      toast.success(response.data?.message || 'Táº£i logo lÃªn thÃ nh cÃ´ng')
      queryClient.invalidateQueries({ queryKey: COMPANY_KEYS.myCompany() })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'CÃ³ lá»—i xáº£y ra khi táº£i logo')
    },
  })
}

export const useAddHrMember = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, email }) => companyService.addMember(id, { email }),
    onSuccess: (response) => {
      toast.success(response.data?.message || 'ThÃªm thÃ nh viÃªn thÃ nh cÃ´ng')
      queryClient.invalidateQueries({ queryKey: COMPANY_KEYS.myCompany() })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'CÃ³ lá»—i xáº£y ra khi thÃªm thÃ nh viÃªn')
    },
  })
}

export const useRemoveHrMember = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, memberId }) => companyService.removeMember(id, memberId),
    onSuccess: (response) => {
      toast.success(response.data?.message || 'XÃ³a thÃ nh viÃªn thÃ nh cÃ´ng')
      queryClient.invalidateQueries({ queryKey: COMPANY_KEYS.myCompany() })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'CÃ³ lá»—i xáº£y ra khi xÃ³a thÃ nh viÃªn')
    },
  })
}
