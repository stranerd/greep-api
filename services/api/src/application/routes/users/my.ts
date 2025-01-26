import { isAuthenticated } from '@application/middlewares'
import { LikesUseCases, TagEntity, TagTypes, TagsUseCases } from '@modules/interactions'
import { PromotionsUseCases } from '@modules/marketplace'
import { TransactionType, TransactionsUseCases } from '@modules/payment'
import { UserEntity, UserType, UsersUseCases } from '@modules/users'
import { getCoordsHashSlice } from '@utils/types'
import { ApiDef, AuthRole, Conditions, QueryKeys, QueryParams, QueryResults, QueryWhere, Router } from 'equipped'

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

router.get<MyVendorsGetRouteDef>({ path: '/vendors', key: 'users-my-vendors' })(async (req) => {
	const query = req.query
	query.authType = QueryKeys.and
	query.auth = [
		{ field: 'type.type', value: UserType.vendor },
		{ field: `roles.${AuthRole.isVendor}`, value: true },
		{ field: 'dates.deletedAt', value: null },
	]
	query.sort ??= []
	query.sort.push({ field: `account.ratings.avg`, desc: true })

	const user = await UsersUseCases.find(req.authUser!.id)
	if (user && user.account.location) {
		const hashSlice = getCoordsHashSlice(user.account.location.hash ?? '', req.query.nearby ? 2500 : 10000)
		query.auth.push({ field: 'type.location.hash', value: new RegExp(`^${hashSlice}`) })
	}

	const tags: TagEntity[] = []
	if (query.byFoodsTagNames && query.byFoodsTagNames.length)
		await TagsUseCases.autoCreate({ type: TagTypes.productsFoods, titles: query.byFoodsTagNames }).then((res) => tags.push(...res))
	if (query.byItemsTagNames && query.byItemsTagNames.length)
		await TagsUseCases.autoCreate({ type: TagTypes.productsItems, titles: query.byItemsTagNames }).then((res) => tags.push(...res))
	if (tags.length)
		query.auth.push({
			condition: QueryKeys.or,
			value: tags.map((t) => ({ field: `vendors.tags.${t.id}`, condition: Conditions.gte, value: 1 })),
		})

	if (query.favorite) {
		const likes = await LikesUseCases.get({
			where: [
				{ field: 'user.id', value: req.authUser!.id },
				{ field: 'value', value: true },
			],
			all: true,
		})
		const vendors = likes.results.map((like) => like.entity.id)
		query.auth.push({ field: 'id', condition: Conditions.in, value: vendors })
	}

	if (query.quick) {
		const promotions = await PromotionsUseCases.get({ all: true })
		const promoQueries = promotions.results
			.filter((p) => p.active)
			.map((p) => {
				const query: QueryWhere<unknown>[] = []
				if (p.vendorIds?.length) query.push({ field: 'id', condition: Conditions.in, value: p.vendorIds })
				if (p.vendorType?.length) query.push({ field: 'type.vendorType', condition: Conditions.in, value: p.vendorType })
				return { condition: QueryKeys.and, value: query }
			})
		if (promoQueries.length) query.auth.push({ condition: QueryKeys.or, value: promoQueries as any })
	}

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

type MyVendorsGetRouteDef = ApiDef<{
	key: 'users-my-vendors'
	method: 'get'
	query: QueryParams & { nearby?: boolean; byFoodsTagNames?: string[]; byItemsTagNames?: string[]; favorite?: boolean; quick?: boolean }
	response: QueryResults<UserEntity>
}>
