import { ErrorRepository } from './data/repositories/errors'
import { EmailsUseCase } from './domain/useCases/emails'

const errorRepository = ErrorRepository.getInstance()

export const EmailsUseCases = new EmailsUseCase(errorRepository)

export { ErrorFromModel } from './data/models/errors'
export { ErrorEntity } from './domain/entities/errors'