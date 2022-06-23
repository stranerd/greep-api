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

	requestAddDriver (managerId: string, driverId: string, commission: number, add: boolean): Promise<boolean>

	acceptManager (managerId: string, driverId: string, commission: number, accept: boolean): Promise<boolean>

	updateDriverCommission (managerId: string, driverId: string, commission: number): Promise<boolean>

	removeDriver (managerId: string, driverId: string): Promise<boolean>

	updatePushTokens (userId: string, tokens: string[], add: boolean): Promise<boolean>
}