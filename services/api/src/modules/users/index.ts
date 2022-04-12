import { UserRepository } from './data/repositories/users'
import { FindUserUseCase } from './domain/useCases/users/findUser'
import { CreateUserWithBioUseCase } from './domain/useCases/users/createUserWithBio'
import { UpdateUserWithBioUseCase } from './domain/useCases/users/updateUserWithBio'
import { MarkUserAsDeletedUseCase } from './domain/useCases/users/markUserAsDeleted'
import { UpdateUserWithRolesUseCase } from './domain/useCases/users/updateUserWithRoles'
import { GetUsersUseCase } from './domain/useCases/users/getUsers'
import { UpdateUserStatusUseCase } from './domain/useCases/users/updateUserStatus'
import { ReferralRepository } from './data/repositories/referrals'
import { FindReferralUseCase } from './domain/useCases/referrals/findReferral'
import { CreateReferralUseCase } from './domain/useCases/referrals/createReferral'
import { GetReferralsUseCase } from './domain/useCases/referrals/getReferrals'
import { ResetAllUsersStatusUseCase } from './domain/useCases/users/resetAllUsersStatus'

const userRepository = UserRepository.getInstance()
const referralRepository = ReferralRepository.getInstance()

export const GetUsers = new GetUsersUseCase(userRepository)
export const FindUser = new FindUserUseCase(userRepository)
export const CreateUserWithBio = new CreateUserWithBioUseCase(userRepository)
export const UpdateUserWithBio = new UpdateUserWithBioUseCase(userRepository)
export const UpdateUserWithRoles = new UpdateUserWithRolesUseCase(userRepository)
export const MarkUserAsDeleted = new MarkUserAsDeletedUseCase(userRepository)
export const UpdateUserStatus = new UpdateUserStatusUseCase(userRepository)
export const ResetAllUsersStatus = new ResetAllUsersStatusUseCase(userRepository)

export const GetReferrals = new GetReferralsUseCase(referralRepository)
export const FindReferral = new FindReferralUseCase(referralRepository)
export const CreateReferral = new CreateReferralUseCase(referralRepository)

export { ReferralFromModel } from './data/models/referrals'
export { UserFromModel } from './data/models/users'
export { ReferralEntity } from './domain/entities/referrals'
export { UserEntity } from './domain/entities/users'
export { UserBio, UserRoles } from './domain/types'