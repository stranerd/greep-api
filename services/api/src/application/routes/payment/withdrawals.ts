import { isAuthenticated, isDriver } from '@application/middlewares'
import { WithdrawalEntity, WithdrawalStatus, WithdrawalsUseCases } from '@modules/payment'
import { ApiDef, NotAuthorizedError, NotFoundError, QueryParams, QueryResults, Router, Schema, validate } from 'equipped'

const router = new Router({ path: '/withdrawals', groups: ['Withdrawals'], middlewares: [isAuthenticated] })

router.get<PaymentWithdrawalsGetRouteDef>({ path: '/', key: 'payment-withdrawals-get' })(async (req) => {
	const query = req.query
	query.auth = [
		{ field: 'userId', value: req.authUser!.id },
		{ field: 'agentId', value: req.authUser!.id },
		{ field: 'status', value: WithdrawalStatus.created },
	]
	return await WithdrawalsUseCases.get(query)
})

router.get<PaymentWithdrawalsFindRouteDef>({ path: '/:id', key: 'payment-withdrawals-find' })(async (req) => {
	const withdrawal = await WithdrawalsUseCases.find(req.params.id)
	if (!withdrawal) throw new NotFoundError()
	const hasAccess =
		withdrawal.userId === req.authUser!.id || withdrawal.agentId === req.authUser!.id || withdrawal.status === WithdrawalStatus.created
	if (!hasAccess) throw new NotFoundError()
	return withdrawal
})

router.post<PaymentWithdrawalsAssignAgentRouteDef>({
	path: '/:id/assignAgent',
	key: 'payment-withdrawals-assign-agent',
	middlewares: [isDriver],
})(async (req) => {
	const updated = await WithdrawalsUseCases.assignAgent({
		id: req.params.id,
		agentId: req.authUser!.id,
	})
	if (updated) return updated
	throw new NotAuthorizedError()
})

router.get<PaymentWithdrawalsTokenRouteDef>({ path: '/:id/token', key: 'payment-withdrawals-token' })(
	async (req) =>
		await WithdrawalsUseCases.generateToken({
			id: req.params.id,
			userId: req.authUser!.id,
		}),
)

router.post<PaymentWithdrawalsCompleteRouteDef>({ path: '/:id/complete', key: 'payment-withdrawals-complete' })(async (req) => {
	const { token } = validate({ token: Schema.string().min(1) }, req.body)

	const updated = await WithdrawalsUseCases.complete({
		id: req.params.id,
		userId: req.authUser!.id,
		token,
	})
	if (updated) return updated
	throw new NotAuthorizedError()
})

export default router

type PaymentWithdrawalsGetRouteDef = ApiDef<{
	key: 'payment-withdrawals-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<WithdrawalEntity>
}>

type PaymentWithdrawalsFindRouteDef = ApiDef<{
	key: 'payment-withdrawals-find'
	method: 'get'
	params: { id: string }
	response: WithdrawalEntity
}>

type PaymentWithdrawalsAssignAgentRouteDef = ApiDef<{
	key: 'payment-withdrawals-assign-agent'
	method: 'post'
	params: { id: string }
	response: WithdrawalEntity
}>

type PaymentWithdrawalsTokenRouteDef = ApiDef<{
	key: 'payment-withdrawals-token'
	method: 'get'
	params: { id: string }
	response: string
}>

type PaymentWithdrawalsCompleteRouteDef = ApiDef<{
	key: 'payment-withdrawals-complete'
	method: 'post'
	params: { id: string }
	body: { token: string }
	response: WithdrawalEntity
}>
