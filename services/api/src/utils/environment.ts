import { getEnvOrFail, Instance } from '@stranerd/api-commons'
import { EmailsList } from '@utils/types/email'

export const environment = getEnvOrFail('ENVIRONMENT')
export const isDev = environment === 'local'

export const port = parseInt(getEnvOrFail('PORT'))
export const appId = getEnvOrFail('APP_ID')

export const superAdminEmail = getEnvOrFail('SUPER_ADMIN')

const mails = JSON.parse(getEnvOrFail('EMAILS') || '{}')
export const emails = Object.fromEntries(
	Object.entries(EmailsList).map(([key, value]) => [value, {
		privateKey: mails[key.toLowerCase()]?.private_key,
		clientId: mails[key.toLowerCase()]?.client_id
	}])
)

export const accessTokenKey = getEnvOrFail('ACCESS_TOKEN_KEY')
export const refreshTokenKey = getEnvOrFail('REFRESH_TOKEN_KEY')
export const mongoDbURI = getEnvOrFail('MONGODB_URI')
export const rabbitURI = getEnvOrFail('RABBITMQ_URI')
export const redisURI = getEnvOrFail('REDIS_URI')

Instance.initialize({
	accessTokenKey, refreshTokenKey,
	mongoDbURI, rabbitURI, redisURI,
	isDev, appId,
	bullQueueName: 'greep-task-queues',
	rabbitColumnName: 'Greep'
})
export const appInstance = Instance.getInstance()
