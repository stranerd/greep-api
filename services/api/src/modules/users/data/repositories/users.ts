import { appInstance } from '@utils/environment'
import { Location, updateRatings } from '@utils/types'
import { IUserRepository } from '../../domain/i-repositories/users'
import { UserAccount, UserBio, UserMeta, UserRankings, UserRoles, UserTypeData, UserVendorData } from '../../domain/types'
import { UserMapper } from '../mappers/users'
import { UserFromModel } from '../models/users'
import { User } from '../mongooseModels/users'

export class UserRepository implements IUserRepository {
	private static instance: UserRepository
	private mapper = new UserMapper()

	static getInstance(): UserRepository {
		if (!UserRepository.instance) UserRepository.instance = new UserRepository()
		return UserRepository.instance
	}

	async get(query) {
		const data = await appInstance.dbs.mongo.query(User, query)
		return {
			...data,
			results: data.results.map((u) => this.mapper.mapFrom(u)!),
		}
	}

	async createUserWithBio(userId: string, data: UserBio, timestamp: number) {
		await User.findByIdAndUpdate(
			userId,
			{
				$set: { bio: data },
				$setOnInsert: { _id: userId, dates: { createdAt: timestamp, deletedAt: null } },
			},
			{ upsert: true },
		)
	}

	async updateUserWithBio(userId: string, data: UserBio, _: number) {
		await User.findByIdAndUpdate(
			userId,
			{
				$set: { bio: data },
				$setOnInsert: { _id: userId },
			},
			{ upsert: true },
		)
	}

	async find(userId: string) {
		const user = await User.findById(userId)
		return this.mapper.mapFrom(user)
	}

	async markUserAsDeleted(userId: string, timestamp: number) {
		await User.findByIdAndUpdate(
			userId,
			{
				$set: { 'dates.deletedAt': timestamp },
			},
			{},
		)
	}

	async updateUserWithRoles(userId: string, data: UserRoles) {
		await User.findByIdAndUpdate(
			userId,
			{
				$set: { roles: data },
			},
			{ upsert: true },
		)
	}

	async updateUserStatus(userId: string, socketId: string, add: boolean) {
		const user = await User.findByIdAndUpdate(userId, {
			$set: { 'status.lastUpdatedAt': Date.now() },
			[add ? '$addToSet' : '$pull']: { 'status.connections': socketId },
		})
		return !!user
	}

	async resetAllUsersStatus() {
		const res = await User.updateMany(
			{},
			{
				$set: { 'status.connections': [] },
			},
		)
		return !!res.acknowledged
	}

	async updateScore(userId: string, amount: number) {
		const rankings = Object.fromEntries(Object.keys(UserRankings).map((key) => [`account.rankings.${key}.value`, amount]))
		const now = Date.now()
		const lastUpdatedAt = Object.fromEntries(Object.keys(UserRankings).map((key) => [`account.rankings.${key}.lastUpdatedAt`, now]))
		const user = await User.findByIdAndUpdate(userId, {
			$set: lastUpdatedAt,
			$inc: rankings,
		})
		return !!user
	}

	async resetRankings(key: keyof UserAccount['rankings']) {
		const res = await User.updateMany(
			{},
			{
				$set: { [`account.rankings.${key}`]: { value: 0, lastUpdatedAt: Date.now() } },
			},
		)
		return !!res.acknowledged
	}

	async incrementUserMetaProperty(userId: string, propertyName: keyof UserAccount['meta'], value: 1 | -1) {
		await User.findByIdAndUpdate(userId, {
			$inc: {
				[`account.meta.${propertyName}`]: value,
				[`account.meta.${UserMeta.total}`]: value,
			},
		})
	}

	async updateType(userId: string, data: UserTypeData) {
		const user = await User.findOneAndUpdate(
			{ _id: userId, $or: [{ type: null }, { 'type.type': data.type }] },
			{ $set: { type: data } },
			{ new: true },
		)
		return this.mapper.mapFrom(user)
	}

	async updateApplication(userId: string, data: UserAccount['application']) {
		const user = await User.findOneAndUpdate(
			{ _id: userId, 'account.application': null },
			{ $set: { 'account.application': data } },
			{ new: true },
		)
		return !!user
	}

	async updateTrip({ driverId, userId, count }: { driverId: string; userId: string; count: number }) {
		const user = await User.findByIdAndUpdate(userId, { $inc: { [`account.trips.${driverId}.trips`]: count } }, { new: true })
		return !!user
	}

	async updateDebt({ driverId, userId, count }: { driverId: string; userId: string; count: number }) {
		const user = await User.findByIdAndUpdate(userId, { $inc: { [`account.trips.${driverId}.debt`]: count } }, { new: true })
		return !!user
	}

	async updateLocation({ userId, location }: { userId: string; location: Location }) {
		const user = await User.findByIdAndUpdate(userId, { $set: { ['account.location']: location } }, { new: true })
		return !!user
	}

	async updateSettings(userId: string, settings: Partial<UserAccount['settings']>) {
		settings = Object.fromEntries(Object.entries(settings).map(([key, value]) => [`account.settings.${key}`, value]))
		const user = await User.findByIdAndUpdate(userId, { $set: settings }, { new: true })
		return this.mapper.mapFrom(user)
	}

	async updateSavedLocations(userId: string, savedLocations: UserAccount['savedLocations']) {
		const user = await User.findByIdAndUpdate(userId, { $set: { 'account.savedLocations': savedLocations } }, { new: true })
		return this.mapper.mapFrom(user)
	}

	async updateVendor<Type extends keyof UserVendorData>(userId: string, type: Type, data: UserVendorData[Type]) {
		const user = await User.findByIdAndUpdate(userId, { $set: { [`vendor.${type}`]: data } }, { new: true })
		return this.mapper.mapFrom(user)
	}

	async updateVendorTags(userId: string, tagIds: string[], add: boolean) {
		let res: UserFromModel | null = null
		await User.collection.conn.transaction(async (session) => {
			const user = await User.findById(userId, {}, { session })
			if (!user) return res
			tagIds.forEach((tagId) => {
				user.vendor.tags[tagId] ??= 0
				user.vendor.tags[tagId] += add ? 1 : -1
			})
			user.vendor.tags = Object.fromEntries(Object.entries(user.vendor.tags).filter(([_, value]) => value > 0))
			return (res = await user.save({ session }))
		})
		return this.mapper.mapFrom(res)
	}

	async updateRatings(id: string, rating: number, add: boolean) {
		let res = false
		await User.collection.conn.transaction(async (session) => {
			const user = await User.findById(id, {}, { session })
			if (!user) return res
			res = !!(await User.findByIdAndUpdate(
				id,
				{ $set: { 'account.ratings': updateRatings(user.account.ratings, rating, add) } },
				{ session },
			))
			return res
		})
		return res
	}
}
