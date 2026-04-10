import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { normalizeUserMedia } from '@shared/utils'

function normalizeUserPatch(userData = {}) {
  const { fullName, avatar, profile, ...rest } = userData

  const profilePatch = {
    ...(profile || {}),
    ...(fullName !== undefined ? { fullName } : {}),
    ...(avatar !== undefined ? { avatar } : {}),
  }

  return {
    ...rest,
    ...(Object.keys(profilePatch).length > 0 ? { profile: profilePatch } : {}),
  }
}

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      isAuthenticated: false,

      // Actions
      setCredentials: ({ user, accessToken }) => {
        set({
          user: normalizeUserMedia(user),
          accessToken,
          isAuthenticated: true,
        })
      },

      updateUser: (userData) => {
        const incomingUser = normalizeUserPatch(userData)

        set((state) => ({
          user: normalizeUserMedia({
            ...(state.user || {}),
            ...incomingUser,
            profile: {
              ...(state.user?.profile || {}),
              ...(incomingUser.profile || {}),
            },
          }),
        }))
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        })
      },

      // Getters
      getRole: () => get().user?.role || null,
      isCandidate: () => get().user?.role === 'candidate',
      isHR: () => get().user?.role === 'hr',
      isAdmin: () => get().user?.role === 'admin',
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore
