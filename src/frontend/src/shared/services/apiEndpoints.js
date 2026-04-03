// ============================================
// API Endpoints — Smart Recruitment Platform
// ============================================

const API = {
  // --- Auth ---
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    ME: '/auth/me',
  },

  // --- Users ---
  USERS: {
    BASE: '/users',
    BY_ID: (id) => `/users/${id}`,
    PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
  },

  // --- Companies ---
  COMPANIES: {
    BASE: '/companies',
    BY_ID: (id) => `/companies/${id}`,
    MY_COMPANY: '/companies/my-company',
    MEMBERS: (id) => `/companies/${id}/members`,
    REMOVE_MEMBER: (id, memberId) => `/companies/${id}/members/${memberId}`,
    UPLOAD_LOGO: (id) => `/companies/${id}/logo`,
  },

  // --- Jobs ---
  JOBS: {
    BASE: '/jobs',
    BY_ID: (id) => `/jobs/${id}`,
    BY_COMPANY: (companyId) => `/companies/${companyId}/jobs`,
    SEARCH: '/jobs/search',
    FAVORITES: '/jobs/favorites',
    TOGGLE_FAVORITE: (id) => `/jobs/${id}/favorite`,
  },

  // --- CVs ---
  CVS: {
    BASE: '/cvs',
    BY_ID: (id) => `/cvs/${id}`,
    UPLOAD: '/cvs/upload',
    SET_DEFAULT: (id) => `/cvs/${id}/default`,
    PARSE_OCR: (id) => `/cvs/${id}/parse`,
  },

  // --- Applications ---
  APPLICATIONS: {
    BASE: '/applications',
    BY_ID: (id) => `/applications/${id}`,
    BY_JOB: (jobId) => `/jobs/${jobId}/applications`,
    MY_APPLICATIONS: '/applications/my-applications',
    UPDATE_STATUS: (id) => `/applications/${id}/status`,
    WITHDRAW: (id) => `/applications/${id}/withdraw`,
  },

  // --- Interviews ---
  INTERVIEWS: {
    BASE: '/interviews',
    BY_ID: (id) => `/interviews/${id}`,
    BY_APPLICATION: (appId) => `/applications/${appId}/interviews`,
  },

  // --- Notifications ---
  NOTIFICATIONS: {
    BASE: '/notifications',
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    UNREAD_COUNT: '/notifications/unread-count',
  },

  // --- Chat ---
  CHAT: {
    CONVERSATIONS: '/chat/conversations',
    MESSAGES: (conversationId) => `/chat/conversations/${conversationId}/messages`,
  },

  // --- Admin ---
  ADMIN: {
    USERS: '/admin/users',
    USER_BY_ID: (id) => `/admin/users/${id}`,
    TOGGLE_BLOCK: (id) => `/admin/users/${id}/toggle-block`,
    PENDING_COMPANIES: '/admin/companies/pending',
    APPROVE_COMPANY: (id) => `/admin/companies/${id}/approve`,
    REJECT_COMPANY: (id) => `/admin/companies/${id}/reject`,
    LOCK_COMPANY: (id) => `/admin/companies/${id}/lock`,
    PENDING_JOBS: '/admin/jobs/pending',
    APPROVE_JOB: (id) => `/admin/jobs/${id}/approve`,
    REJECT_JOB: (id) => `/admin/jobs/${id}/reject`,
    DASHBOARD: '/admin/dashboard',
    CATEGORIES: '/admin/categories',
    SKILLS: '/admin/skills',
    LOCATIONS: '/admin/locations',
  },
}

export default API
