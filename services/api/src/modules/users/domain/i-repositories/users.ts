import { QueryParams, QueryResults } from 'equipped'
import { UserEntity } from '../entities/users'
import { ActivityScores, UserAccount, UserBio, UserRoles, UserTypeData } from '../types'

export interface IUserRepository {
	get(query: QueryParams): Promise<QueryResults<UserEntity>>

	createUserWithBio(userId: string, data: UserBio, timestamp: number): Promise<void>

	updateUserWithBio(userId: string, data: UserBio, timestamp: number): Promise<void>

	updateUserWithRoles(userId: string, data: UserRoles, timestamp: number): Promise<void>

	markUserAsDeleted(userId: string, timestamp: number): Promise<void>

	find(userId: string): Promise<UserEntity | null>

	updateUserStatus(userId: string, socketId: string, add: boolean): Promise<boolean>

	resetAllUsersStatus(): Promise<boolean>

	incrementUserMetaProperty (userId: string, propertyName: keyof UserAccount['meta'], value: 1 | -1): Promise<void>

	updateScore (userId: string, amount: ActivityScores): Promise<boolean>

	resetRankings (key: keyof UserAccount['rankings']): Promise<boolean>

	updateType (userId: string, data: UserTypeData): Promise<UserEntity | null>

	updateApplication (userId, data: UserAccount['application']): Promise<boolean>
}