import { Location } from '@utils/types'
import { QueryParams, QueryResults } from 'equipped'
import { UserEntity } from '../entities/users'
import { UserAccount, UserBio, UserRoles, UserTypeData, UserVendorData } from '../types'

export interface IUserRepository {
	get(query: QueryParams): Promise<QueryResults<UserEntity>>

	createUserWithBio(userId: string, data: UserBio, timestamp: number): Promise<void>

	updateUserWithBio(userId: string, data: UserBio, timestamp: number): Promise<void>

	updateUserWithRoles(userId: string, data: UserRoles, timestamp: number): Promise<void>

	markUserAsDeleted(userId: string, timestamp: number): Promise<void>

	find(userId: string): Promise<UserEntity | null>

	updateUserStatus(userId: string, socketId: string, add: boolean): Promise<boolean>

	resetAllUsersStatus(): Promise<boolean>

	incrementUserMetaProperty(userId: string, propertyName: keyof UserAccount['meta'], value: 1 | -1): Promise<void>

	updateScore(userId: string, amount: number): Promise<boolean>

	resetRankings(key: keyof UserAccount['rankings']): Promise<boolean>

	updateType(userId: string, data: UserTypeData): Promise<UserEntity | null>

	updateApplication(userId, data: UserAccount['application']): Promise<boolean>

	updateTrip(data: { driverId: string; userId: string; count: number }): Promise<boolean>

	updateDebt(data: { driverId: string; userId: string; count: number }): Promise<boolean>

	updateLocation(data: { userId: string; location: Location }): Promise<boolean>

	updateSettings(userId: string, settings: Partial<UserAccount['settings']>): Promise<UserEntity | null>

	updateSavedLocations(userId: string, savedLocations: UserAccount['savedLocations']): Promise<UserEntity | null>

	updateVendor<Type extends keyof UserVendorData>(userId: string, type: Type, data: UserVendorData[Type]): Promise<UserEntity | null>

	updateVendorTags(userId: string, tagIds: string[], add: boolean): Promise<UserEntity | null>

	updateRatings(id: string, ratings: number, add: boolean): Promise<boolean>
}
