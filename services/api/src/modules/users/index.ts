import { UserRepository } from './data/repositories/users'
import { ReferralRepository } from './data/repositories/referrals'
import { CustomerRepository } from './data/repositories/customers'
import { TransactionRepository } from './data/repositories/transactions'
import { UsersUseCase } from './domain/useCases/users'
import { ReferralsUseCase } from './domain/useCases/referrals'
import { CustomersUseCase } from './domain/useCases/customers'
import { TransactionsUseCase } from './domain/useCases/transactions'

const userRepository = UserRepository.getInstance()
const referralRepository = ReferralRepository.getInstance()
const customerRepository = CustomerRepository.getInstance()
const transactionRepository = TransactionRepository.getInstance()

export const UsersUseCases = new UsersUseCase(userRepository)
export const ReferralsUseCases = new ReferralsUseCase(referralRepository)
export const CustomersUseCases = new CustomersUseCase(customerRepository)
export const TransactionsUseCases = new TransactionsUseCase(transactionRepository)

export { ReferralFromModel } from './data/models/referrals'
export { UserFromModel } from './data/models/users'
export { CustomerFromModel } from './data/models/customers'
export { TransactionFromModel } from './data/models/transactions'
export { ReferralEntity } from './domain/entities/referrals'
export { UserEntity } from './domain/entities/users'
export { CustomerEntity } from './domain/entities/customers'
export { TransactionEntity } from './domain/entities/transactions'
export { UserBio, UserRoles, TransactionType, PaymentType } from './domain/types'