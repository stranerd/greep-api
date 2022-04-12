import { TokenRepository } from './data/repositories/tokens'
import { FindUserTokensUseCase } from './domain/useCases/findUserTokens'
import { UpdateUserTokensUseCase } from './domain/useCases/updateUserTokens'
import { DeleteUserTokensUseCase } from './domain/useCases/deleteUserTokens'

const tokenRepository = TokenRepository.getInstance()

export const FindUserTokens = new FindUserTokensUseCase(tokenRepository)
export const UpdateUserTokens = new UpdateUserTokensUseCase(tokenRepository)
export const DeleteUserTokens = new DeleteUserTokensUseCase(tokenRepository)

export { TokenFromModel } from './data/models/tokens'
export { TokenEntity } from './domain/entities/tokens'