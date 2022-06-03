import { IUserRepository } from '../../domain/i-repositories/users'
import { UserBio, UserRoles } from '../../domain/types'
import { UserMapper } from '../mappers/users'
import { User } from '../mongooseModels/users'
import { mongoose, parseQueryParams } from '@stranerd/api-commons'
import { UserFromModel } from '../models/users'

export class UserRepository implements IUserRepository {
	private static instance: UserRepository
	private mapper = new UserMapper()

	static getInstance (): UserRepository {
		if (!UserRepository.instance) UserRepository.instance = new UserRepository()
		return UserRepository.instance
	}

	async get (query) {
		const data = await parseQueryParams<UserFromModel>(User, query)
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
		}, { upsert: true })
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

	async requestAddDriver (managerId: string, driverId: string, commission: number, add: boolean) {
		const driver = await User.findOneAndUpdate(
			{ _id: driverId, manager: null },
			{ [add ? '$push' : '$pull']: { managerId, commission } })
		return !!driver
	}

	async acceptManager (managerId: string, driverId: string, commission: number, accept: boolean) {
		const session = await mongoose.startSession()
		let res = false
		await session.withTransaction(async (session) => {
			if (!accept) {
				const driver = await User.findOneAndUpdate(
					{ _id: driverId, manager: null },
					{ $pull: { managerRequests: { managerId, commission } } },
					{ session })
				res = !!driver
			} else {
				const driver = await User.findOneAndUpdate(
					{ _id: driverId, manager: null },
					{ $set: { manager: { managerId, commission }, managerRequests: [] } },
					{ session })
				if (!driver) return false
				const manager = await User.findOneAndUpdate(
					{ _id: managerId, 'drivers.driverId': { $ne: driverId } },
					{ $addToSet: { drivers: { driverId, commission } } },
					{ session })
				res = !!manager && !!driver
			}
			return res
		})
		await session.endSession()
		return res
	}

	async updateDriverCommission (managerId: string, driverId: string, commission: number) {
		const session = await mongoose.startSession()
		let res = false
		await session.withTransaction(async (session) => {
			const driver = await User.findOneAndUpdate(
				{ _id: driverId, 'manager.managerId': managerId },
				{ $set: { 'manager.commission': commission } },
				{ session })
			if (!driver) return false
			const manager = await User.findOneAndUpdate(
				{ _id: managerId, 'drivers.driverId': driverId },
				{ $set: { 'drivers.$.commission': commission } },
				{ session })
			res = !!manager && !!driver
			return res
		})
		await session.endSession()
		return res
	}

	async removeDriver (managerId: string, driverId: string) {
		const session = await mongoose.startSession()
		let res = false
		await session.withTransaction(async (session) => {
			const driver = await User.findOneAndUpdate(
				{ _id: driverId, 'manager.managerId': managerId },
				{ $set: { manager: null } },
				{ session })
			if (!driver) return false
			const manager = await User.findOneAndUpdate(
				{ _id: managerId, 'drivers.driverId': driverId },
				{ $pull: { drivers: { driverId } } },
				{ session })
			res = !!manager && !!driver
			return res
		})
		await session.endSession()
		return res
	}
}