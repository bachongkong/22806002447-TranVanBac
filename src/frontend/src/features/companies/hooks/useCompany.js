import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import companyService from '../services/companyService'

// Query Keys
export const COMPANY_KEYS = {
  all: ['companies'],
  lists: () => [...COMPANY_KEYS.all, 'list'],
  list: (filters) => [...COMPANY_KEYS.lists(), { filters }],
  details: () => [...COMPANY_KEYS.all, 'detail'],
  detail: (id) => [...COMPANY_KEYS.details(), id],
  myCompany: () => [...COMPANY_KEYS.all, 'my-company'],
  members: (id) => [...COMPANY_KEYS.detail(id), 'members'],
}

// ------------------------------------
// Queries
// ------------------------------------

export const useGetMyCompany = () => {
  return useQuery({
    queryKey: COMPANY_KEYS.myCompany(),
    queryFn: async () => {
      try {
        const response = await companyService.getMyCompany()
        return response.data?.data
      } catch (error) {
        // Return null instead of throwing if user doesn't have a company yet
        if (error.response?.status === 404) {
          return null
        }
        throw error
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// ------------------------------------
// Mutations
// ------------------------------------

export const useCreateCompany = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => companyService.create(data),
    onSuccess: (response) => {
      toast.success(response.data?.message || 'Tạo công ty thành công')
      queryClient.invalidateQueries({ queryKey: COMPANY_KEYS.myCompany() })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tạo công ty')
    },
  })
}

export const useUpdateCompany = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => companyService.update(id, data),
    onSuccess: (response) => {
      toast.success(response.data?.message || 'Cập nhật thành công')
      queryClient.invalidateQueries({ queryKey: COMPANY_KEYS.myCompany() })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật')
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
      toast.success(response.data?.message || 'Tải logo lên thành công')
      queryClient.invalidateQueries({ queryKey: COMPANY_KEYS.myCompany() })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tải logo')
    },
  })
}

export const useAddHrMember = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, email }) => companyService.addMember(id, { email }),
    onSuccess: (response, variables) => {
      toast.success(response.data?.message || 'Thêm thành viên thành công')
      queryClient.invalidateQueries({ queryKey: COMPANY_KEYS.myCompany() })
      // If we use separate getMembers, invalidate those too, but myCompany returns populated hrMembers
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm thành viên')
    },
  })
}

export const useRemoveHrMember = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, memberId }) => companyService.removeMember(id, memberId),
    onSuccess: (response) => {
      toast.success(response.data?.message || 'Xóa thành viên thành công')
      queryClient.invalidateQueries({ queryKey: COMPANY_KEYS.myCompany() })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa thành viên')
    },
  })
}
