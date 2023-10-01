import { WithdrawalsUseCases } from '@modules/payment'
import { QueryParams, Request } from 'equipped'

export class WithdrawalsController {
	static async find (req: Request) {
		const withdrawal = await WithdrawalsUseCases.find(req.params.id)
		if (!withdrawal || withdrawal.userId !== req.authUser!.id) return null
		return withdrawal
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'userId', value: req.authUser!.id }]
		return await WithdrawalsUseCases.get(query)
	}
}