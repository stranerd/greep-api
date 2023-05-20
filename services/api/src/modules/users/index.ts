import { ReferralRepository } from './data/repositories/referrals'
import { UserRepository } from './data/repositories/users'
import { ReferralsUseCase } from './domain/useCases/referrals'
import { UsersUseCase } from './domain/useCases/users'

const userRepository = UserRepository.getInstance()
const referralRepository = ReferralRepository.getInstance()

export const UsersUseCases = new UsersUseCase(userRepository)
export const ReferralsUseCases = new ReferralsUseCase(referralRepository)

export { EmbeddedUser, UserRankings } from './domain/types'
