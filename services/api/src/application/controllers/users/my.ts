import { TransactionType, TransactionsUseCases } from '@modules/payment'
import { UserType, UsersUseCases } from '@modules/users'
import { Conditions, QueryParams, Request } from 'equipped'

export class MyController {
	static async quickSend (req: Request) {
		const query = req.query as QueryParams

		const mySentTransactions = await TransactionsUseCases.get({
			where: [
				{ field: 'data.type', value: TransactionType.Sent },
				{ field: 'userId', value: req.authUser!.id }
			],
			all: true
		})

		const users = mySentTransactions.results
			.map((txn) => txn.data.type === TransactionType.Sent ? txn.data.to : null)
			.filter(Boolean)

		query.auth = [{ field: 'id', condition: Conditions.in, value: users }]
		return await UsersUseCases.get(query)
	}

	static async drivers (req: Request) {
		const query = req.query as QueryParams
		// TODO: add availability check
		query.auth = [{ field: 'type.type', value: UserType.driver }]
		return await UsersUseCases.get(query)
	}
}