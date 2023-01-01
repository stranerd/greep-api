export const environment = import.meta.env.VITE_API_ENVIRONMENT as string ?? ''

export const googleClientId = import.meta.env.VITE_API_GOOGLE_CLIENT_ID as string ?? ''

export const apiBase = import.meta.env.VITE_API_API_BASE as string ?? ''

export const isServer = () => process.server
export const isClient = () => process.client
