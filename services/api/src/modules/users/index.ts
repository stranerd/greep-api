import { CustomerRepository } from './data/repositories/customers'
import { ReferralRepository } from './data/repositories/referrals'
import { TransactionRepository } from './data/repositories/transactions'
import { TripRepository } from './data/repositories/trips'
import { UserRepository } from './data/repositories/users'
import { CustomersUseCase } from './domain/useCases/customers'
import { ReferralsUseCase } from './domain/useCases/referrals'
import { TransactionsUseCase } from './domain/useCases/transactions'
import { TripsUseCase } from './domain/useCases/trips'
import { UsersUseCase } from './domain/useCases/users'

const userRepository = UserRepository.getInstance()
const referralRepository = ReferralRepository.getInstance()
const customerRepository = CustomerRepository.getInstance()
const transactionRepository = TransactionRepository.getInstance()
const tripRepository = TripRepository.getInstance()

export const UsersUseCases = new UsersUseCase(userRepository)
export const ReferralsUseCases = new ReferralsUseCase(referralRepository)
export const CustomersUseCases = new CustomersUseCase(customerRepository)
export const TransactionsUseCases = new TransactionsUseCase(transactionRepository)
export const TripsUseCases = new TripsUseCase(tripRepository)

export { EmbeddedUser, PaymentType, TransactionType, TripStatus, UserRankings } from './domain/types'
