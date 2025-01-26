import { ActivityRepository } from './data/repositories/activities'
import { ReferralRepository } from './data/repositories/referrals'
import { UserRepository } from './data/repositories/users'
import { ActivitiesUseCase } from './domain/useCases/activities'
import { ReferralsUseCase } from './domain/useCases/referrals'
import { UsersUseCase } from './domain/useCases/users'

const userRepository = UserRepository.getInstance()
const referralRepository = ReferralRepository.getInstance()
const activityRepository = ActivityRepository.getInstance()

export const UsersUseCases = new UsersUseCase(userRepository)
export const ReferralsUseCases = new ReferralsUseCase(referralRepository)
export const ActivitiesUseCases = new ActivitiesUseCase(activityRepository)

export { ActivityEntity } from './domain/entities/activities'
export { ReferralEntity } from './domain/entities/referrals'
export { generateDefaultUser, UserEntity } from './domain/entities/users'
export { ActivityType, UserMeta, UserRankings, UserType, UserVendorBusinessDays, UserVendorType } from './domain/types'
export type { BusinessTime, EmbeddedUser } from './domain/types'
export { isVendorOpen, mergeWithUsers } from './utils'
