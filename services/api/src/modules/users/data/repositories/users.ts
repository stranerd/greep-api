import { appInstance } from '@utils/environment'
import { IUserRepository } from '../../domain/i-repositories/users'
import { UserAccount, UserBio, UserMeta, UserRankings, UserRoles, UserTypeData } from '../../domain/types'
import { UserMapper } from '../mappers/users'
import { User } from '../mongooseModels/users'

export class UserRepository implements IUserRepository {
	private static instance: UserRepository
	private mapper = new UserMapper()

	static getInstance (): UserRepository {
		if (!UserRepository.instance) UserRepository.instance = new UserRepository()
		return UserRepository.instance
	}

	async get (query) {
		const data = await appInstance.dbs.mongo.query(User, query)
		return {
			...data,
			results: data.results.map((u) => this.mapper.mapFrom(u)!)
		}
	}

	async createUserWithBio (userId: string, data: UserBio, timestamp: number) {
		await User.findByIdAndUpdate(userId, {
			$set: { bio: data },
			$setOnInsert: { _id: userId, dates: { createdAt: timestamp, deletedAt: null } }
		}, { upsert: true })
	}

	async updateUserWithBio (userId: string, data: UserBio, _: number) {
		await User.findByIdAndUpdate(userId, {
			$set: { bio: data },
			$setOnInsert: { _id: userId }
		}, { upsert: true })
	}

	async find (userId: string) {
		const user = await User.findById(userId)
		return this.mapper.mapFrom(user)
	}

	async markUserAsDeleted (userId: string, timestamp: number) {
		await User.findByIdAndUpdate(userId, {
			$set: { 'dates.deletedAt': timestamp }
		}, {})
	}

	async updateUserWithRoles (userId: string, data: UserRoles) {
		await User.findByIdAndUpdate(userId, {
			$set: { roles: data }
		}, { upsert: true })
	}

	async updateUserStatus (userId: string, socketId: string, add: boolean) {
		const user = await User.findByIdAndUpdate(userId, {
			$set: { 'status.lastUpdatedAt': Date.now() },
			[add ? '$addToSet' : '$pull']: { 'status.connections': socketId }
		})
		return !!user
	}

	async resetAllUsersStatus () {
		const res = await User.updateMany({}, {
			$set: { 'status.connections': [] }
		})
		return !!res.acknowledged
	}

	async updateScore (userId: string, amount: number) {
		const rankings = Object.fromEntries(
			Object.keys(UserRankings).map((key) => [`account.rankings.${key}.value`, amount])
		)
		const now = Date.now()
		const lastUpdatedAt = Object.fromEntries(
			Object.keys(UserRankings).map((key) => [`account.rankings.${key}.lastUpdatedAt`, now])
		)
		const user = await User.findByIdAndUpdate(userId, {
			$set: lastUpdatedAt, $inc: rankings
		})
		return !!user
	}

	async resetRankings (key: keyof UserAccount['rankings']) {
		const res = await User.updateMany({}, {
			$set: { [`account.rankings.${key}`]: { value: 0, lastUpdatedAt: Date.now() } }
		})
		return !!res.acknowledged
	}

	async incrementUserMetaProperty (userId: string, propertyName: keyof UserAccount['meta'], value: 1 | -1) {
		await User.findByIdAndUpdate(userId, {
			$inc: {
				[`account.meta.${propertyName}`]: value,
				[`account.meta.${UserMeta.total}`]: value
			}
		})
	}

	async updateType (userId: string, data: UserTypeData) {
		const user = await User.findOneAndUpdate(
			{ _id: userId, $or: [{ type: null }, { 'type.type': data.type }] },
			{ $set: { type: data, 'account.application': null } },
			{ new: true }
		)
		return this.mapper.mapFrom(user)
	}

	async updateApplication (userId: string, data: UserAccount['application']) {
		const user = await User.findOneAndUpdate(
			{ _id: userId, 'account.application': null },
			{ $set: { 'account.application': data } },
			{ new: true }
		)
		return !!user
	}
}