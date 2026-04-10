import api from './api'

export const metroService = {
  validateTicket: async (ticketCode, stationCode) => {
    const response = await api.post(`/metro/tickets/${ticketCode}/validate-entry`, {
      stationCode
    })
    return response.data
  },

  manualInspection: async (ticketCode, reason) => {
    const response = await api.post(`/metro/tickets/${ticketCode}/manual-inspection`, {
      reason
    })
    return response.data
  },

  getTicketInfo: async (ticketCode) => {
    const response = await api.get(`/metro/tickets/${ticketCode}`)
    return response.data
  }
}

export const userService = {
  getUsers: async (params = {}) => {
    const response = await api.get('/users', { params })
    return response.data
  },

  updateUserRole: async (userId, role) => {
    const response = await api.patch(`/users/${userId}/role`, { role })
    return response.data
  },

  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`)
    return response.data
  }
}

export default metroService
