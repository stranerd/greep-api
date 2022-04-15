import { UserRepository } from './data/repositories/users'
import { ReferralRepository } from './data/repositories/referrals'
import { CustomerRepository } from './data/repositories/customers'
import { UsersUseCase } from './domain/useCases/users'
import { ReferralsUseCase } from './domain/useCases/referrals'
import { CustomersUseCase } from './domain/useCases/customers'

const userRepository = UserRepository.getInstance()
const referralRepository = ReferralRepository.getInstance()
const customerRepository = CustomerRepository.getInstance()

export const UsersUseCases = new UsersUseCase(userRepository)
export const ReferralsUseCases = new ReferralsUseCase(referralRepository)
export const CustomersUseCases = new CustomersUseCase(customerRepository)

export { ReferralFromModel } from './data/models/referrals'
export { UserFromModel } from './data/models/users'
export { CustomerFromModel } from './data/models/customers'
export { ReferralEntity } from './domain/entities/referrals'
export { UserEntity } from './domain/entities/users'
export { CustomerEntity } from './domain/entities/customers'
export { UserBio, UserRoles } from './domain/types'