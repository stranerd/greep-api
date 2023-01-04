import { UserApiDataSource } from './data/datasources/userApi'
import { CustomerApiDataSource } from './data/datasources/customerApi'
import { TripApiDataSource } from './data/datasources/tripApi'
import { TransactionApiDataSource } from './data/datasources/transactionApi'
import { UserTransformer } from './data/transformers/user'
import { CustomerTransformer } from './data/transformers/customer'
import { TripTransformer } from './data/transformers/trip'
import { TransactionTransformer } from './data/transformers/transaction'
import { UserRepository } from './data/repositories/user'
import { CustomerRepository } from './data/repositories/customer'
import { TripRepository } from './data/repositories/trip'
import { TransactionRepository } from './data/repositories/transaction'
import { UsersUseCase } from './domain/usecases/users'
import { CustomersUseCase } from './domain/usecases/customers'
import { TripsUseCase } from './domain/usecases/trips'
import { TransactionsUseCase } from './domain/usecases/transactions'
import { generateDefaultBio, generateDefaultRoles, generateEmbeddedUser, UserEntity } from './domain/entities/user'
import { CustomerEntity } from './domain/entities/customer'
import { TripEntity } from './domain/entities/trip'
import { TransactionEntity } from './domain/entities/transaction'
import { EmbeddedUser, RankingTimes, UserBio, UserRoles } from './domain/types'

const userDataSource = new UserApiDataSource()
const customerDataSource = new CustomerApiDataSource()
const tripDataSource = new TripApiDataSource()
const transactionDataSource = new TransactionApiDataSource()

const userTransformer = new UserTransformer()
const customerTransformer = new CustomerTransformer()
const tripTransformer = new TripTransformer()
const transactionTransformer = new TransactionTransformer()

const userRepository = new UserRepository(userDataSource, userTransformer)
const customerRepository = new CustomerRepository(customerDataSource, customerTransformer)
const tripRepository = new TripRepository(tripDataSource, tripTransformer)
const transactionRepository = new TransactionRepository(transactionDataSource, transactionTransformer)

export const UsersUseCases = new UsersUseCase(userRepository)
export const CustomersUseCases = new CustomersUseCase(customerRepository)
export const TripsUseCases = new TripsUseCase(tripRepository)
export const TransactionsUseCases = new TransactionsUseCase(transactionRepository)

export {
	UserEntity,
	RankingTimes,
	generateDefaultBio,
	generateDefaultRoles,
	generateEmbeddedUser,
	CustomerEntity,
	TripEntity,
	TransactionEntity
}
export type { UserBio, UserRoles, EmbeddedUser }
