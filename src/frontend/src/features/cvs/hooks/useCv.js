import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

import cvService from '../services/cvService'

export const CV_KEYS = {
  all: ['cvs'],
  lists: () => [...CV_KEYS.all, 'list'],
}

export const useGetMyCvs = () => {
  return useQuery({
    queryKey: CV_KEYS.lists(),
    queryFn: async () => {
      const response = await cvService.getMyCvs()
      return response.data?.data || []
    },
  })
}

export const useParseOcrCv = () => {
  return useMutation({
    mutationFn: (file) => {
      const formData = new FormData()
      formData.append('file', file)
      return cvService.parseOcrPreview(formData)
    },
    onSuccess: () => {
      toast.success('BÃ³c tÃ¡ch thÃ´ng tin tá»« file thÃ nh cÃ´ng')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'CÃ³ lá»—i xáº£y ra khi trÃ­ch xuáº¥t hoáº·c Ä‘á»‹nh dáº¡ng file khÃ´ng há»— trá»£.')
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
    onSuccess: () => {
      toast.success('LÆ°u file CV thÃ nh cÃ´ng')
      queryClient.invalidateQueries({ queryKey: CV_KEYS.lists() })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'CÃ³ lá»—i khi lÆ°u file')
    },
  })
}

export const useCreateOnlineCv = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => cvService.createOnlineCv(data),
    onSuccess: () => {
      toast.success('Táº¡o CV Online thÃ nh cÃ´ng')
      queryClient.invalidateQueries({ queryKey: CV_KEYS.lists() })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Táº¡o CV tháº¥t báº¡i.')
    },
  })
}

export const useUpdateOnlineCv = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => cvService.updateOnlineCv(id, data),
    onSuccess: () => {
      toast.success('Cáº­p nháº­t CV thÃ nh cÃ´ng')
      queryClient.invalidateQueries({ queryKey: CV_KEYS.lists() })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Cáº­p nháº­t tháº¥t báº¡i.')
    },
  })
}

export const useSetDefaultCv = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => cvService.setDefault(id),
    onSuccess: () => {
      toast.success('Thay Ä‘á»•i CV máº·c Ä‘á»‹nh thÃ nh cÃ´ng')
      queryClient.invalidateQueries({ queryKey: CV_KEYS.lists() })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'CÃ³ lá»—i xáº£y ra khi set default.')
    },
  })
}

export const useDeleteCv = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => cvService.deleteCv(id),
    onSuccess: () => {
      toast.success('ÄÃ£ xÃ³a CV')
      queryClient.invalidateQueries({ queryKey: CV_KEYS.lists() })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'XÃ³a CV tháº¥t báº¡i.')
    },
  })
}
