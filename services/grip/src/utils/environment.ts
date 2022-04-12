import { getEnvOrFail, Instance } from '@stranerd/api-commons'

const environment = getEnvOrFail('ENVIRONMENT')
export const isDev = environment === 'local'

export const port = parseInt(getEnvOrFail('PORT'))
export const appId = getEnvOrFail('APP_ID')

export const superAdminEmail = getEnvOrFail('SUPER_ADMIN')

export const accessTokenKey = getEnvOrFail('ACCESS_TOKEN_KEY')
export const refreshTokenKey = getEnvOrFail('REFRESH_TOKEN_KEY')
export const mongoDbURI = getEnvOrFail('MONGODB_URI')
export const rabbitURI = getEnvOrFail('RABBITMQ_URI')
export const redisURI = getEnvOrFail('REDIS_URI')

Instance.initialize({
	accessTokenKey, accessTokenTTL: 60 * 60,
	refreshTokenKey, refreshTokenTTL: 14 * 24 * 60 * 60,
	mongoDbURI, rabbitURI, redisURI,
	isDev, appId,
	bullQueueName: 'grip-task-queues',
	rabbitColumnName: 'Grip'
})
export const appInstance = Instance.getInstance()
