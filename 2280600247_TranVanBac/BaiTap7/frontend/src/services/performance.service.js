import api from './api'

export const performanceService = {
  getUsersDataset: async ({ size = 1500, delayMs = 0 } = {}) => {
    const response = await api.get('/performance/datasets/users', {
      params: { size, delayMs }
    })
    return response.data
  }
}

export default performanceService
