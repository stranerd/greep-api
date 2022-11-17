import { UserRepository } from './data/repositories/users'
import { CustomerRepository } from './data/repositories/customers'
import { TransactionRepository } from './data/repositories/transactions'
import { TripRepository } from './data/repositories/trips'
import { UsersUseCase } from './domain/useCases/users'
import { CustomersUseCase } from './domain/useCases/customers'
import { TransactionsUseCase } from './domain/useCases/transactions'
import { TripsUseCase } from './domain/useCases/trips'

const userRepository = UserRepository.getInstance()
const customerRepository = CustomerRepository.getInstance()
const transactionRepository = TransactionRepository.getInstance()
const tripRepository = TripRepository.getInstance()

export const UsersUseCases = new UsersUseCase(userRepository)
export const CustomersUseCases = new CustomersUseCase(customerRepository)
export const TransactionsUseCases = new TransactionsUseCase(transactionRepository)
export const TripsUseCases = new TripsUseCase(tripRepository)

export { UserFromModel } from './data/models/users'
export { CustomerFromModel } from './data/models/customers'
export { TransactionFromModel } from './data/models/transactions'
export { TripFromModel } from './data/models/trips'
export { UserEntity } from './domain/entities/users'
export { CustomerEntity } from './domain/entities/customers'
export { TransactionEntity } from './domain/entities/transactions'
export { TripEntity } from './domain/entities/trips'
export { EmbeddedUser, UserBio, UserRoles, TransactionType, PaymentType, TripStatus } from './domain/types'