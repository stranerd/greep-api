import { UserEntity } from '../entities/users'
import { UserBio, UserRoles } from '../types'
import { QueryParams, QueryResults } from '@stranerd/api-commons'

export interface IUserRepository {
	get (query: QueryParams): Promise<QueryResults<UserEntity>>

	createUserWithBio (userId: string, data: UserBio, timestamp: number): Promise<void>

	updateUserWithBio (userId: string, data: UserBio, timestamp: number): Promise<void>

	updateUserWithRoles (userId: string, data: UserRoles, timestamp: number): Promise<void>

	markUserAsDeleted (userId: string, timestamp: number): Promise<void>

	find (userId: string): Promise<UserEntity | null>

	updateUserStatus (userId: string, socketId: string, add: boolean): Promise<boolean>

	resetAllUsersStatus (): Promise<boolean>

	addDriver (managerId: string, driverId: string, commission: number): Promise<boolean>

	updateDriverCommission (managerId: string, driverId: string, commission: number): Promise<boolean>

	removeDriver (managerId: string, driverId: string): Promise<boolean>
}