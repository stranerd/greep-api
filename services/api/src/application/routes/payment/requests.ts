import { isAuthenticated } from '@application/middlewares'
import { Currencies, RequestEntity, RequestsUseCases, WalletsUseCases } from '@modules/payment'
import { UsersUseCases } from '@modules/users'
import {
	ApiDef,
	BadRequestError,
	NotAuthorizedError,
	NotFoundError,
	QueryKeys,
	QueryParams,
	QueryResults,
	Router,
	Schema,
	validate,
} from 'equipped'

const router = new Router({ path: '/requests', groups: ['Requests'], middlewares: [isAuthenticated] })

router.get<PaymentRequestsGetRouteDef>({ path: '/', key: 'payment-requests-get' })(async (req) => {
	const query = req.query
	query.auth = [
		{ field: 'from', value: req.authUser!.id },
		{ field: 'to', value: req.authUser!.id },
	]
	query.authType = QueryKeys.or
	return await RequestsUseCases.get(query)
})

router.get<PaymentRequestsFindRouteDef>({ path: '/:id', key: 'payment-requests-find' })(async (req) => {
	const request = await RequestsUseCases.find(req.params.id)
	if (!request || (request.from !== req.authUser!.id && request.to !== req.authUser!.id)) throw new NotFoundError()
	return request
})

router.post<PaymentRequestsCreateRouteDef>({ path: '/', key: 'payment-requests-create' })(async (req) => {
	const data = validate(
		{
			description: Schema.string().min(1),
			to: Schema.string()
				.min(1)
				.ne(req.authUser!.id, (val, comp) => val === comp, 'cannot send request to yourself'),
			amount: Schema.number().gt(0),
			currency: Schema.in(Object.values(Currencies)).default(Currencies.TRY),
		},
		req.body,
	)

	const to = await UsersUseCases.find(data.to)
	if (!to || to.isDeleted()) throw new NotFoundError('user not found')

	return await RequestsUseCases.create({
		...data,
		from: req.authUser!.id,
	})
})

router.post<PaymentRequestsRejectRouteDef>({ path: '/:id/reject', key: 'payment-requests-reject' })(async (req) => {
	const updated = await RequestsUseCases.accept({ id: req.params.id, userId: req.authUser!.id, value: false })
	if (updated) return updated
	throw new NotAuthorizedError()
})

router.post<PaymentRequestsAcceptRouteDef>({ path: '/:id/accept', key: 'payment-requests-accept' })(async (req) => {
	const authUser = req.authUser!
	const request = await RequestsUseCases.find(req.params.id)
	if (!request || request.to !== req.authUser!.id) throw new NotAuthorizedError()

	const data = validate({ payWithWallet: Schema.boolean() }, req.body)

	if (data.payWithWallet) {
		const user = await UsersUseCases.find(request.from)
		if (!user || user.isDeleted()) throw new BadRequestError('user not found')
		const transferred = await WalletsUseCases.transfer({
			from: authUser.id,
			fromEmail: authUser.email,
			fromName: authUser.username,
			to: user.id,
			toEmail: user.bio.email,
			toName: user.bio.username,
			amount: request.amount,
			currency: request.currency,
			note: request.description,
		})
		if (!transferred) throw new BadRequestError('transfer failed')
	}

	const updated = await RequestsUseCases.accept({ id: request.id, userId: req.authUser!.id, value: true })
	if (updated) return updated
	throw new NotAuthorizedError()
})

router.post<PaymentRequestsAcknowledgeRouteDef>({ path: '/:id/acknowledge', key: 'payment-requests-acknowledge' })(async (req) => {
	const updated = await RequestsUseCases.acknowledge({ id: req.params.id, userId: req.authUser!.id, value: true })
	if (updated) return updated
	throw new NotAuthorizedError()
})

export default router

type PaymentRequestsGetRouteDef = ApiDef<{
	key: 'payment-requests-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<RequestEntity>
}>

type PaymentRequestsFindRouteDef = ApiDef<{
	key: 'payment-requests-find'
	method: 'get'
	params: { id: string }
	response: RequestEntity
}>

type PaymentRequestsCreateRouteDef = ApiDef<{
	key: 'payment-requests-create'
	method: 'post'
	body: { description: string; to: string; amount: number; currency: Currencies }
	response: RequestEntity
}>

type PaymentRequestsRejectRouteDef = ApiDef<{
	key: 'payment-requests-reject'
	method: 'post'
	params: { id: string }
	response: RequestEntity
}>

type PaymentRequestsAcceptRouteDef = ApiDef<{
	key: 'payment-requests-accept'
	method: 'post'
	params: { id: string }
	body: { payWithWallet: boolean }
	response: RequestEntity
}>

type PaymentRequestsAcknowledgeRouteDef = ApiDef<{
	key: 'payment-requests-acknowledge'
	method: 'post'
	params: { id: string }
	response: RequestEntity
}>
