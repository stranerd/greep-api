import { UserApiDataSource } from './data/datasources/userApi'
import { CustomerApiDataSource } from './data/datasources/customerApi'
import { UserTransformer } from './data/transformers/user'
import { CustomerTransformer } from './data/transformers/customer'
import { UserRepository } from './data/repositories/user'
import { CustomerRepository } from './data/repositories/customer'
import { UsersUseCase } from './domain/usecases/users'
import { CustomersUseCase } from './domain/usecases/customers'
import { generateDefaultBio, generateDefaultRoles, generateEmbeddedUser, UserEntity } from './domain/entities/user'
import { CustomerEntity } from './domain/entities/customer'
import { EmbeddedUser, RankingTimes, UserBio, UserRoles } from './domain/types'

const userDataSource = new UserApiDataSource()
const customerDataSource = new CustomerApiDataSource()

const userTransformer = new UserTransformer()
const customerTransformer = new CustomerTransformer()

const userRepository = new UserRepository(userDataSource, userTransformer)
const customerRepository = new CustomerRepository(customerDataSource, customerTransformer)

export const UsersUseCases = new UsersUseCase(userRepository)
export const CustomersUseCases = new CustomersUseCase(customerRepository)

export {
	UserEntity,
	RankingTimes,
	generateDefaultBio,
	generateDefaultRoles,
	generateEmbeddedUser,
	CustomerEntity
}
export type { UserBio, UserRoles, EmbeddedUser }
