import { AuthRepository } from './data/repositories/auth'
import { UserRepository } from './data/repositories/users'
import { AuthUseCase } from './domain/useCases/auth'
import { AuthUsersUseCase } from './domain/useCases/users'
import { generateAuthOutput } from './utils/auth'

const authRepository = AuthRepository.getInstance()
const userRepository = UserRepository.getInstance()

export const AuthUseCases = new AuthUseCase(authRepository)
export const AuthUsersUseCases = new AuthUsersUseCase(userRepository)

export { AuthUserEntity } from './domain/entities/users'
export { Phone } from './domain/types'
export { deleteUnverifiedUsers, generateAuthOutput, getNewTokens, signOutUser, verifyReferrer } from './utils/auth'
export type AuthResponse = Awaited<ReturnType<typeof generateAuthOutput>>
