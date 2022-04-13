import { IUserRepository } from '../../domain/i-repositories/users'
import { RegisterInput, RoleInput, UserUpdateInput } from '../../domain/types'
import { UserMapper } from '../mappers/users'
import { UserFromModel } from '../models/users'
import { AuthTypes, deleteCachedAccessToken, NotFoundError, parseQueryParams, QueryParams } from '@stranerd/api-commons'
import User from '../mongooseModels/users'
import { hash } from '@utils/hash'

export class UserRepository implements IUserRepository {
	private static instance: UserRepository
	private mapper: UserMapper

	private constructor () {
		this.mapper = new UserMapper()
	}

	static getInstance (): UserRepository {
		if (!UserRepository.instance) UserRepository.instance = new UserRepository()
		return UserRepository.instance
	}

	async findUser (id: string) {
		const user = await User.findById(id)
		return this.mapper.mapFrom(user)
	}

	async getUsers (query: QueryParams) {
		const data = await parseQueryParams<UserFromModel>(User, query)
		return {
			...data,
			results: data.results.map((u) => this.mapper.mapFrom(u)!)
		}
	}

	async deleteUsers (userIds: string[]) {
		await User.deleteMany({ _id: { $in: userIds } })
	}

	async updateUserProfile (userId: string, data: UserUpdateInput) {
		const user = await User.findOneAndUpdate({ _id: userId }, { $set: data }, { new: true })
		return this.mapper.mapFrom(user)!
	}

	async updateDetails (userId: string, details: RegisterInput) {
		const user = await User.findByIdAndUpdate(
			userId,
			{
				$set: {
					...details,
					password: await hash(details.password),
					lastSignedInAt: Date.now()
				},
				$addToSet: {
					authTypes: AuthTypes.email
				}
			},
			{ new: true }
		)
		if (!user) throw new NotFoundError()

		return this.mapper.mapFrom(user)!

	}

	async updateUserRole (roleInput: RoleInput) {
		await User.findByIdAndUpdate(roleInput.userId, {
			$set: {
				[`roles.${roleInput.role}`]: roleInput.value
			}
		})
		// clear accessToken
		await deleteCachedAccessToken(roleInput.userId)
		return true
	}

	async updatePassword (userId: string, password: string) {
		const user = await User.findByIdAndUpdate(userId, {
			$set: { password: await hash(password) },
			$addToSet: { authTypes: AuthTypes.email }
		})
		return !!user
	}
}