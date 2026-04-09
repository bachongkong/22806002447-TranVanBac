import { apiClient, API } from '@shared/services'
import { normalizeUserMedia, resolveAssetUrl } from '@shared/utils'

export const profileService = {
  getProfile: async () => {
    const response = await apiClient.get(API.USERS.PROFILE)
    return normalizeUserMedia(response.data.data)
  },

  updateProfile: async (data) => {
    const response = await apiClient.put(API.USERS.PROFILE, data)
    return normalizeUserMedia(response.data.data)
  },

  changePassword: async (data) => {
    const response = await apiClient.put(API.USERS.CHANGE_PASSWORD, data)
    return response.data.data
  },

  uploadAvatar: async (file) => {
    const formData = new FormData()
    formData.append('avatar', file)
    
    const response = await apiClient.put(API.USERS.UPLOAD_AVATAR, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return {
      ...response.data.data,
      avatar: resolveAssetUrl(response.data.data?.avatar),
    }
  },
}
