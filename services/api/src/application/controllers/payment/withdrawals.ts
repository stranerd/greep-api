import { WithdrawalsUseCases } from '@modules/payment'
import { UsersUseCases } from '@modules/users'
import { NotAuthorizedError, NotFoundError, QueryParams, Request, Schema, validate } from 'equipped'

export class WithdrawalsController {
	static async find (req: Request) {
		const withdrawal = await WithdrawalsUseCases.find(req.params.id)
		if (!withdrawal || withdrawal.userId !== req.authUser!.id) throw new NotFoundError()
		return withdrawal
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'userId', value: req.authUser!.id }]
		return await WithdrawalsUseCases.get(query)
	}

	static async assignAgent (req: Request) {
		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new NotFoundError('profile not found')
		if (!user.isDriver()) throw new NotAuthorizedError()

		return await WithdrawalsUseCases.assignAgent({
			id: req.params.id,
			agentId: req.authUser!.id
		})
	}

	static async generateToken (req: Request) {
		return await WithdrawalsUseCases.generateToken({
			id: req.params.id,
			userId: req.authUser!.id
		})
	}

	static async complete (req: Request) {
		const { token } = validate({
			token: Schema.string().min(1)
		}, req.body)

		return await WithdrawalsUseCases.complete({
			id: req.params.id,
			userId: req.authUser!.id,
			token
		})
	}
}