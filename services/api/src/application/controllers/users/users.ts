import { UsersUseCases } from '@modules/users'
import { BadRequestError, NotFoundError, QueryParams, Request, validate, Validation } from '@stranerd/api-commons'

export class UsersController {
	static async getUsers (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'dates.deletedAt', value: null }]
		return await UsersUseCases.get(query)
	}

	static async findUser (req: Request) {
		const user = await UsersUseCases.find(req.params.id)
		if (!user || user.isDeleted()) throw new NotFoundError()
		return user
	}

	static async addDriver (req: Request) {
		const authUserId = req.authUser!.id
		const { driverId, add, commission } = validate({
			driverId: req.body.driverId,
			commission: req.body.commission,
			add: req.body.add
		}, {
			driverId: { required: true, rules: [Validation.isString] },
			add: { required: true, rules: [Validation.isBoolean] },
			commission: {
				required: true,
				rules: [Validation.isNumber, Validation.isMoreThanOrEqualToX(0), Validation.isLessThanOrEqualToX(1)]
			}
		})

		if (add) {
			if (driverId === authUserId) throw new BadRequestError('you can\'t add yourself as a driver. Just record transactions automatically')
			const manager = await UsersUseCases.find(authUserId)
			if (!manager || manager.isDeleted()) throw new BadRequestError('profile not found')
			if (manager.manager) throw new BadRequestError('someone else can\'t drive for you when you have a manager')

			const driver = await UsersUseCases.find(driverId)
			if (!driver || driver.isDeleted()) throw new BadRequestError('driver not found')
			if (driver.manager) throw new BadRequestError('driver already has a manager')
			const request = driver.managerRequests.find((r) => r.managerId === authUserId)
			if (request) throw new BadRequestError('you have already requested to become this driver\'s manager')
		}

		return await UsersUseCases.requestAddDriver({ driverId, add, commission, managerId: authUserId })
	}

	static async acceptManager (req: Request) {
		const authUserId = req.authUser!.id
		const { managerId, accept } = validate({
			managerId: req.body.managerId,
			accept: req.body.accept
		}, {
			managerId: { required: true, rules: [Validation.isString] },
			accept: { required: true, rules: [Validation.isBoolean] }
		})

		if (accept && managerId === authUserId) throw new BadRequestError('you can\'t add yourself as a driver. Just record transactions automatically')
		const driver = await UsersUseCases.find(authUserId)
		if (!driver || driver.isDeleted()) throw new BadRequestError('profile not found')
		if (driver.manager) throw new BadRequestError('you already have a manager')
		const request = driver.managerRequests.find((r) => r.managerId === managerId)
		if (!request) throw new BadRequestError('no request from managerId found')

		const manager = await UsersUseCases.find(managerId)
		if (!manager || manager.isDeleted()) throw new BadRequestError('manager not found')
		if (manager.manager) throw new BadRequestError('manager is already driving for someone else')

		return await UsersUseCases.acceptManager({
			managerId,
			accept,
			driverId: authUserId,
			commission: request.commission
		})
	}

	static async updateDriverCommission (req: Request) {
		const data = validate({
			driverId: req.body.driverId,
			commission: req.body.commission
		}, {
			driverId: { required: true, rules: [Validation.isString] },
			commission: {
				required: true,
				rules: [Validation.isNumber, Validation.isMoreThanOrEqualToX(0), Validation.isLessThanOrEqualToX(1)]
			}
		})
		const driver = await UsersUseCases.find(data.driverId)
		if (!driver || driver.isDeleted()) throw new BadRequestError('driver not found')
		return await UsersUseCases.updateDriverCommission({ ...data, managerId: req.authUser!.id })
	}

	static async removeDriver (req: Request) {
		const data = validate({
			driverId: req.body.driverId
		}, {
			driverId: { required: true, rules: [Validation.isString] }
		})
		return await UsersUseCases.removeDriver({ ...data, managerId: req.authUser!.id })
	}

	static async push (req: Request) {
		const { token, add } = validate({
			token: req.body.token,
			add: req.body.add
		}, {
			token: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			add: { required: true, rules: [Validation.isBoolean] }
		})
		return await UsersUseCases.updatePushTokens({ userId: req.authUser!.id, tokens: [token], add })
	}
}