import '@utils/types/enums'
import { EmailsList, getEnvOrFail, Instance } from 'equipped'

const useSSL = parseInt(getEnvOrFail('USE_SSL'))
export const baseDomain = `http${useSSL ? 's' : ''}://` + getEnvOrFail('BASE_DOMAIN')
export const environment = getEnvOrFail('ENVIRONMENT')
export const isDev = environment === 'local'

export const port = parseInt(getEnvOrFail('PORT'))
export const appId = getEnvOrFail('APP_ID')

export const superAdminEmail = getEnvOrFail('SUPER_ADMIN')

const mails = JSON.parse(getEnvOrFail('EMAILS') || '{}')
export const emails = Object.fromEntries(
	Object.entries(EmailsList).map(([key, value]) => [
		value,
		{
			privateKey: mails[key.toLowerCase()]?.private_key,
			clientId: mails[key.toLowerCase()]?.client_id,
		},
	]),
)

const flutterwave = JSON.parse(getEnvOrFail('FLUTTERWAVE') || '{}')
export const flutterwaveConfig = {
	secretKey: flutterwave.secretKey,
	publicKey: flutterwave.publicKey,
}

Instance.initialize({
	isDev,
	appId,
	accessTokenKey: getEnvOrFail('ACCESS_TOKEN_KEY'),
	refreshTokenKey: getEnvOrFail('REFRESH_TOKEN_KEY'),
	bullQueueName: 'greep-task-queues',
	mongoDbURI: getEnvOrFail('MONGODB_URI'),
	redisURI: getEnvOrFail('REDIS_URI'),
	kafkaURIs: getEnvOrFail('KAFKA_URIS').split(','),
	debeziumUrl: getEnvOrFail('DEBEZIUM_URL'),
	eventColumnName: 'Greep',
})
export const appInstance = Instance.get()
