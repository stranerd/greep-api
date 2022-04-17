import { UsersUseCases } from '@modules/users'
import { BadRequestError, QueryParams, Request, validate, Validation } from '@stranerd/api-commons'

export class UsersController {
	static async getUsers (req: Request) {
		const query = req.query as QueryParams
		return await UsersUseCases.get(query)
	}

	static async findUser (req: Request) {
		return await UsersUseCases.find(req.params.id)
	}

	static async addDriver (req: Request) {
		const data = validate({
			driverId: req.body.driverId,
			commission: req.body.driverId
		}, {
			driverId: { required: true, rules: [Validation.isString] },
			commission: {
				required: true,
				rules: [Validation.isNumber, Validation.isMoreThanOrEqualToX(0), Validation.isLessThanOrEqualToX(1)]
			}
		})
		const driver = await UsersUseCases.find(data.driverId)
		if (!driver) throw new BadRequestError('driver not found')
		return UsersUseCases.addDriver({ ...data, managerId: req.authUser!.id })
	}

	static async updateDriverCommission (req: Request) {
		const data = validate({
			driverId: req.body.driverId,
			commission: req.body.driverId
		}, {
			driverId: { required: true, rules: [Validation.isString] },
			commission: {
				required: true,
				rules: [Validation.isNumber, Validation.isMoreThanOrEqualToX(0), Validation.isLessThanOrEqualToX(1)]
			}
		})
		const driver = await UsersUseCases.find(data.driverId)
		if (!driver) throw new BadRequestError('driver not found')
		return UsersUseCases.updateDriverCommission({ ...data, managerId: req.authUser!.id })
	}

	static async removeDriver (req: Request) {
		const data = validate({
			driverId: req.body.driverId
		}, {
			driverId: { required: true, rules: [Validation.isString] }
		})
		return UsersUseCases.removeDriver({ ...data, managerId: req.authUser!.id })
	}
}