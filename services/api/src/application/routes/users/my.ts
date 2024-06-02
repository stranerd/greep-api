import { isAuthenticated } from '@application/middlewares'
import { TransactionType, TransactionsUseCases } from '@modules/payment'
import { UserEntity, UserType, UsersUseCases } from '@modules/users'
import { ApiDef, Conditions, QueryKeys, QueryParams, QueryResults, Router } from 'equipped'

const router = new Router({ path: '/my', groups: ['My'], middlewares: [isAuthenticated] })

router.get<MyQuickSendGetRouteDef>({ path: '/quickSend', key: 'users-my-quick-send' })(async (req) => {
	const query = req.query

	const mySentTransactions = await TransactionsUseCases.get({
		where: [
			{ field: 'data.type', value: TransactionType.Sent },
			{ field: 'userId', value: req.authUser!.id },
		],
		all: true,
	})

	const users = mySentTransactions.results.map((txn) => (txn.data.type === TransactionType.Sent ? txn.data.to : null)).filter(Boolean)

	query.auth = [{ field: 'id', condition: Conditions.in, value: users }]
	return await UsersUseCases.get(query)
})

router.get<MyDriversGetRouteDef>({ path: '/drivers', key: 'users-my-drivers' })(async (req) => {
	const query = req.query
	query.authType = QueryKeys.and
	query.auth = [
		{ field: 'type.type', value: UserType.driver },
		{ field: 'account.settings.driverAvailable', value: true },
	]
	return await UsersUseCases.get(query)
})

export default router

type MyQuickSendGetRouteDef = ApiDef<{
	key: 'users-my-quick-send'
	method: 'get'
	query: QueryParams
	response: QueryResults<UserEntity>
}>

type MyDriversGetRouteDef = ApiDef<{
	key: 'users-my-drivers'
	method: 'get'
	query: QueryParams
	response: QueryResults<UserEntity>
}>
