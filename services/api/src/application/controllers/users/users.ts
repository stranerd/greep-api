import { UsersUseCases } from '@modules/users'
import { BadRequestError, NotFoundError, QueryParams, Request, Schema, validateReq } from 'equipped'

export class UsersController {
	static async getUsers(req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'dates.deletedAt', value: null }]
		return await UsersUseCases.get(query)
	}

	static async getUsersAdmin(req: Request) {
		const query = req.query as QueryParams
		return await UsersUseCases.get(query)
	}

	static async findUser(req: Request) {
		const user = await UsersUseCases.find(req.params.id)
		if (!user || user.isDeleted()) throw new NotFoundError()
		return user
	}

	static async findUserAdmin(req: Request) {
		const user = await UsersUseCases.find(req.params.id)
		if (!user) throw new NotFoundError()
		return user
	}

	static async addDriver(req: Request) {
		const authUserId = req.authUser!.id
		const data = validateReq({
			driverId: Schema.string().min(1),
			commission: Schema.number().gte(0).lte(1),
			add: Schema.boolean()
		}, req.body)

		if (data.add) {
			if (data.driverId === authUserId) throw new BadRequestError('you can\'t add yourself as a driver. Just record transactions automatically')
			const manager = await UsersUseCases.find(authUserId)
			if (!manager || manager.isDeleted()) throw new BadRequestError('profile not found')
			if (manager.manager) throw new BadRequestError('someone else can\'t drive for you when you have a manager')

			const driver = await UsersUseCases.find(data.driverId)
			if (!driver || driver.isDeleted()) throw new BadRequestError('driver not found')
			if (driver.manager) throw new BadRequestError('driver already has a manager')
			if (driver.managerRequests.length) throw new BadRequestError('driver already has a pending request')
			const request = driver.managerRequests.find((r) => r.managerId === authUserId)
			if (request) throw new BadRequestError('you have already requested to become this driver\'s manager')
		}

		return await UsersUseCases.requestAddDriver({ ...data, managerId: authUserId })
	}

	static async acceptManager(req: Request) {
		const authUserId = req.authUser!.id
		const data = validateReq({
			managerId: Schema.string().min(1),
			accept: Schema.boolean()
		}, req.body)

		if (data.accept && data.managerId === authUserId) throw new BadRequestError('you can\'t add yourself as a driver. Just record transactions automatically')
		const driver = await UsersUseCases.find(authUserId)
		if (!driver || driver.isDeleted()) throw new BadRequestError('profile not found')
		if (driver.manager) throw new BadRequestError('you already have a manager')
		const request = driver.managerRequests.find((r) => r.managerId === data.managerId)
		if (!request) throw new BadRequestError('no request from managerId found')

		const manager = await UsersUseCases.find(data.managerId)
		if (!manager || manager.isDeleted()) throw new BadRequestError('manager not found')
		if (manager.manager) throw new BadRequestError('manager is already driving for someone else')

		return await UsersUseCases.acceptManager({
			...data,
			driverId: authUserId,
			commission: request.commission
		})
	}

	static async updateDriverCommission(req: Request) {
		const data = validateReq({
			driverId: Schema.string().min(1),
			commission: Schema.number().gte(0).lte(1)
		}, req.body)
		const driver = await UsersUseCases.find(data.driverId)
		if (!driver || driver.isDeleted()) throw new BadRequestError('driver not found')
		return await UsersUseCases.updateDriverCommission({ ...data, managerId: req.authUser!.id })
	}

	static async removeDriver(req: Request) {
		const data = validateReq({
			driverId: Schema.string().min(1)
		}, req.body)
		return await UsersUseCases.removeDriver({ ...data, managerId: req.authUser!.id })
	}

	static async push(req: Request) {
		const { token, add } = validateReq({
			token: Schema.string().min(1),
			add: Schema.boolean()
		}, req.body)
		return await UsersUseCases.updatePushTokens({ userId: req.authUser!.id, tokens: [token], add })
	}
}