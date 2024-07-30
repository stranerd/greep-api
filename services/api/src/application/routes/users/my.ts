import { isAuthenticated } from '@application/middlewares'
import { TransactionType, TransactionsUseCases } from '@modules/payment'
import { UserEntity, UserType, UsersUseCases } from '@modules/users'
import { getCoordsHashSlice } from '@utils/types'
import { ApiDef, AuthRole, Conditions, QueryKeys, QueryParams, QueryResults, Router } from 'equipped'

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

router.get<MyVendorsNearMeGetRouteDef>({ path: '/vendors/near-me', key: 'users-my-vendors-near-me' })(async (req) => {
	const user = await UsersUseCases.find(req.authUser!.id)
	if (!user) throw new Error('Profile not found')
	const hashSlice = getCoordsHashSlice(user.account.location?.hash ?? '', 1500)
	const query = req.query
	query.authType = QueryKeys.and
	query.auth = [
		{ field: 'type.type', value: UserType.vendor },
		{ field: `roles.${AuthRole.isVendor}`, value: true },
		{ field: 'dates.deletedAt', value: null },
		{ field: 'type.location.hash', value: new RegExp(`^${hashSlice}`) },
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

type MyVendorsNearMeGetRouteDef = ApiDef<{
	key: 'users-my-vendors-near-me'
	method: 'get'
	query: QueryParams
	response: QueryResults<UserEntity>
}>
