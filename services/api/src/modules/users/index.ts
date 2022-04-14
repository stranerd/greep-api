import { UserRepository } from './data/repositories/users'
import { ReferralRepository } from './data/repositories/referrals'
import { UsersUseCase } from './domain/useCases/users'
import { ReferralsUseCase } from './domain/useCases/referrals'

const userRepository = UserRepository.getInstance()
const referralRepository = ReferralRepository.getInstance()

export const UsersUseCases = new UsersUseCase(userRepository)
export const ReferralsUseCases = new ReferralsUseCase(referralRepository)

export { ReferralFromModel } from './data/models/referrals'
export { UserFromModel } from './data/models/users'
export { ReferralEntity } from './domain/entities/referrals'
export { UserEntity } from './domain/entities/users'
export { UserBio, UserRoles } from './domain/types'