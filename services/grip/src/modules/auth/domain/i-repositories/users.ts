import { RegisterInput, RoleInput, UserUpdateInput } from '../types'
import { QueryParams, QueryResults } from '@stranerd/api-commons'
import { UserEntity } from '../entities/users'

export interface IUserRepository {
	findUser (id: string): Promise<UserEntity | null>

	getUsers (query: QueryParams): Promise<QueryResults<UserEntity>>

	updateUserRole (roleInput: RoleInput): Promise<boolean>

	updateDetails (userId: string, credentials: RegisterInput): Promise<UserEntity>

	updateUserProfile (userId: string, input: UserUpdateInput): Promise<UserEntity>

	updatePassword (userId: string, password: string): Promise<boolean>

	deleteUsers (userIds: string[]): Promise<void>
}