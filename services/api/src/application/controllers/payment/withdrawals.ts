import { WithdrawalsUseCases, WithdrawalStatus } from '@modules/payment'
import { NotAuthorizedError, NotFoundError, QueryParams, Request, Schema, validate } from 'equipped'

export class WithdrawalsController {
	static async find (req: Request) {
		const withdrawal = await WithdrawalsUseCases.find(req.params.id)
		if (!withdrawal) throw new NotFoundError()
		const hasAccess = withdrawal.userId === req.authUser!.id || withdrawal.agentId === req.authUser!.id || withdrawal.status === WithdrawalStatus.created
		if (!hasAccess) throw new NotFoundError()
		return withdrawal
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		query.auth = [
			{ field: 'userId', value: req.authUser!.id },
			{ field: 'agentId', value: req.authUser!.id },
			{ field: 'status', value: WithdrawalStatus.created },
		]
		return await WithdrawalsUseCases.get(query)
	}

	static async assignAgent (req: Request) {
		const updated = await WithdrawalsUseCases.assignAgent({
			id: req.params.id,
			agentId: req.authUser!.id
		})
		if (updated) return updated
		throw new NotAuthorizedError()
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

		const updated = await WithdrawalsUseCases.complete({
			id: req.params.id,
			userId: req.authUser!.id,
			token
		})
		if (updated) return updated
		throw new NotAuthorizedError()
	}
}