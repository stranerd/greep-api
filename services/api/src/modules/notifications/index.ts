import { EmailErrorRepository } from './data/repositories/emailErrors'
import { NotificationRepository } from './data/repositories/notifications'
import { PhoneErrorRepository } from './data/repositories/phoneErrors'
import { TokenRepository } from './data/repositories/tokens'
import { EmailErrorsUseCase } from './domain/useCases/emailErrors'
import { NotificationsUseCase } from './domain/useCases/notifications'
import { PhoneErrorsUseCase } from './domain/useCases/phoneErrors'
import { TokensUseCase } from './domain/useCases/tokens'

const emailErrorRepository = EmailErrorRepository.getInstance()
const phoneErrorRepository = PhoneErrorRepository.getInstance()
const tokenRepository = TokenRepository.getInstance()
const notificationRepository = NotificationRepository.getInstance()

export const EmailErrorsUseCases = new EmailErrorsUseCase(emailErrorRepository)
export const PhoneErrorsUseCases = new PhoneErrorsUseCase(phoneErrorRepository)
export const TokensUseCases = new TokensUseCase(tokenRepository)
export const NotificationsUseCases = new NotificationsUseCase(notificationRepository)

export { NotificationType } from './domain/types'
export { sendMailAndCatchError } from './utils/email'
export { sendNotification } from './utils/notifications'
export { sendTextAndCatchError } from './utils/phone'
export { sendPushNotification } from './utils/push'
export { NotificationEntity } from './domain/entities/notifications'
export { EmailErrorEntity } from './domain/entities/emailErrors'
export { PhoneErrorEntity } from './domain/entities/phoneErrors'
export { TokenEntity } from './domain/entities/tokens'
