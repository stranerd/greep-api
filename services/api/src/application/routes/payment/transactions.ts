import { isAuthenticated } from '@application/middlewares'
import {
	Currencies,
	Rates,
	TransactionEntity,
	TransactionStatus,
	TransactionType,
	TransactionsUseCases,
	WalletsUseCases,
	fulfillTransaction,
} from '@modules/payment'
import { flutterwaveConfig } from '@utils/environment'
import {
	ApiDef,
	BadRequestError,
	NotAuthorizedError,
	NotFoundError,
	QueryParams,
	QueryResults,
	Router,
	Schema,
	ValidationError,
	validate,
} from 'equipped'

const router = new Router({ path: '/transactions', groups: ['Transactions'] })

router.get<PaymentTransactionsFlutterwaveSecretsRouteDef>({
	path: '/flutterwave/secrets',
	key: 'payment-transactions-flutterwave-secrets',
})(async () => ({ publicKey: flutterwaveConfig.publicKey }))

router.get<PaymentTransactionsRatesRouteDef>({ path: '/rates', key: 'payment-transactions-rates' })(async () => {
	const entries = Object.entries(Rates).map(async ([key, value]) => [key, await value()] as const)
	const awaitedEntries = await Promise.all(entries)
	return Object.fromEntries(awaitedEntries) as Record<Currencies, number>
})

router.get<PaymentTransactionsGetRouteDef>({ path: '/', key: 'payment-transactions-get', middlewares: [isAuthenticated] })(async (req) => {
	const query = req.query
	query.auth = [{ field: 'userId', value: req.authUser!.id }]
	return await TransactionsUseCases.get(query)
})

router.get<PaymentTransactionsFindRouteDef>({ path: '/:id', key: 'payment-transactions-find', middlewares: [isAuthenticated] })(
	async (req) => {
		const transaction = await TransactionsUseCases.find(req.params.id)
		if (!transaction || transaction.userId !== req.authUser!.id) throw new NotFoundError()
		return transaction
	},
)

router.post<PaymentTransactionsFundRouteDef>({ path: '/fund', key: 'payment-transactions-fund', middlewares: [isAuthenticated] })(
	async (req) => {
		const authUser = req.authUser!

		const wallet = await WalletsUseCases.get(authUser.id)
		if (!wallet.pin) throw new ValidationError([{ field: 'pin', messages: ['pin is not set'] }])

		const { amount, currency } = validate(
			{
				pin: Schema.string()
					.min(4)
					.max(4)
					.eq(wallet.pin, (val, comp) => val === comp, 'invalid pin'),
				amount: Schema.number().gt(0),
				currency: Schema.in(Object.values(Currencies)).default(Currencies.NGN),
			},
			req.body,
		)

		return await TransactionsUseCases.create({
			title: 'Fund wallet',
			currency,
			amount,
			userId: authUser.id,
			email: authUser.email,
			status: TransactionStatus.initialized,
			data: { type: TransactionType.FundWallet, exchangeRate: await Rates[currency]() },
		})
	},
)

router.put<PaymentTransactionsFulfillRouteDef>({
	path: '/:id/fulfill',
	key: 'payment-transactions-fulfill',
	middlewares: [isAuthenticated],
})(async (req) => {
	const transaction = await TransactionsUseCases.find(req.params.id)
	if (!transaction || transaction.userId !== req.authUser!.id) throw new NotAuthorizedError()
	const successful = await fulfillTransaction(transaction)
	if (!successful) throw new BadRequestError('transaction unsuccessful')
	return successful
})

export default router

type PaymentTransactionsFlutterwaveSecretsRouteDef = ApiDef<{
	key: 'payment-transactions-flutterwave-secrets'
	method: 'get'
	response: { publicKey: string }
}>

type PaymentTransactionsRatesRouteDef = ApiDef<{
	key: 'payment-transactions-rates'
	method: 'get'
	response: Record<Currencies, number>
}>

type PaymentTransactionsGetRouteDef = ApiDef<{
	key: 'payment-transactions-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<TransactionEntity>
}>

type PaymentTransactionsFindRouteDef = ApiDef<{
	key: 'payment-transactions-find'
	method: 'get'
	params: { id: string }
	response: TransactionEntity
}>

type PaymentTransactionsFundRouteDef = ApiDef<{
	key: 'payment-transactions-fund'
	method: 'post'
	body: { pin: string; amount: number; currency: Currencies }
	response: TransactionEntity
}>

type PaymentTransactionsFulfillRouteDef = ApiDef<{
	key: 'payment-transactions-fulfill'
	method: 'put'
	params: { id: string }
	response: boolean
}>
