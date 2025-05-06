export const API_ROUTES = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
  },
  CHAT_REQUESTS: {
    RESPOND: '/api/chat-requests/respond',
    SEND: '/api/chat-requests/send',
    RECEIVED: '/api/chat-requests/received',
  },
  USERS: {
    SEARCH_ID_BY_USERNAME_OR_EMAIL: '/api/users/search-id-by-username-or-email',
  },
} as const

export const ROUTES = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
  },
  HOME: '/',
} as const
