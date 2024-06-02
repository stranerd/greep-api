import { isAuthenticated } from '@application/middlewares'
import { Currencies, TransactionEntity, WalletEntity, WalletsUseCases, WithdrawalEntity } from '@modules/payment'
import { UsersUseCases } from '@modules/users'
import { Location, LocationSchema } from '@utils/types'
import { ApiDef, BadRequestError, Router, Schema, ValidationError, validate } from 'equipped'

const router = new Router({ path: '/wallets', groups: ['Wallets'], middlewares: [isAuthenticated] })

router.get<PaymentWalletsGetRouteDef>({ path: '/', key: 'payment-wallets-get' })(async (req) => await WalletsUseCases.get(req.authUser!.id))

router.post<PaymentWalletsTransferRouteDef>({ path: '/transfer', key: 'payment-wallets-transfer' })(async (req) => {
	const authUser = req.authUser!

	const wallet = await WalletsUseCases.get(authUser.id)
	if (!wallet.pin) throw new ValidationError([{ field: 'pin', messages: ['pin is not set'] }])

	const { amount, currency, to, note } = validate(
		{
			pin: Schema.string()
				.min(4)
				.max(4)
				.eq(wallet.pin, (val, comp) => val === comp, 'invalid pin'),
			amount: Schema.number().gt(0),
			currency: Schema.in(Object.values(Currencies)).default(Currencies.TRY),
			to: Schema.string().min(1),
			note: Schema.string(),
		},
		req.body,
	)

	if (to === authUser.id) throw new BadRequestError('cannot transfer to yourself')
	const user = await UsersUseCases.findByUsername(to)
	if (!user || user.isDeleted()) throw new BadRequestError('user not found')

	return await WalletsUseCases.transfer({
		from: authUser.id,
		fromEmail: authUser.email,
		fromName: authUser.username,
		to: user.id,
		toEmail: user.bio.email,
		toName: user.bio.username,
		amount,
		currency,
		note,
	})
})

router.post<PaymentWalletsWithdrawRouteDef>({ path: '/withdraw', key: 'payment-wallets-withdraw' })(async (req) => {
	const authUser = req.authUser!
	const wallet = await WalletsUseCases.get(authUser.id)
	if (!wallet.pin) throw new ValidationError([{ field: 'pin', messages: ['pin is not set'] }])

	const { amount, location } = validate(
		{
			pin: Schema.string()
				.min(4)
				.max(4)
				.eq(wallet.pin, (val, comp) => val === comp, 'invalid pin'),
			amount: Schema.number().gte(100),
			location: LocationSchema(),
		},
		req.body,
	)

	return await WalletsUseCases.withdraw({
		userId: authUser.id,
		email: authUser.email,
		amount,
		location,
	})
})

router.post<PaymentWalletsSendPinResetMailRouteDef>({ path: '/pin/reset/mail', key: 'payment-wallets-send-pin-reset-mail' })(
	async (req) =>
		await WalletsUseCases.sendPinResetMail({
			userId: req.authUser!.id,
			email: req.authUser!.email,
		}),
)

router.post<PaymentWalletsResetPinRouteDef>({ path: '/pin/reset', key: 'payment-wallets-reset-pin' })(async (req) => {
	const { token, pin } = validate(
		{
			token: Schema.force.string(),
			pin: Schema.string().min(4).max(4),
		},
		req.body,
	)

	return await WalletsUseCases.resetPin({ userId: req.authUser!.id, token, pin })
})

router.post<PaymentWalletsVerifyPinRouteDef>({ path: '/pin/verify', key: 'payment-wallets-verify-pin' })(async (req) => {
	const wallet = await WalletsUseCases.get(req.authUser!.id)
	if (!wallet.pin) throw new ValidationError([{ field: 'pin', messages: ['pin is not set'] }])

	const { pin } = validate({ pin: Schema.string() }, req.body)

	return wallet.pin === pin
})

router.post<PaymentWalletsUpdatePinRouteDef>({ path: '/pin', key: 'payment-wallets-update-pin' })(async (req) => {
	const { oldPin, pin } = validate(
		{
			oldPin: Schema.string().nullable().default(null),
			pin: Schema.string().min(4).max(4),
		},
		req.body,
	)

	return await WalletsUseCases.updatePin({ userId: req.authUser!.id, oldPin, pin })
})

export default router

type PaymentWalletsGetRouteDef = ApiDef<{
	key: 'payment-wallets-get'
	method: 'get'
	response: WalletEntity
}>

type PaymentWalletsTransferRouteDef = ApiDef<{
	key: 'payment-wallets-transfer'
	method: 'post'
	body: {
		pin: number
		amount: number
		currency: Currencies
		to: string
		note: string
	}
	response: TransactionEntity
}>

type PaymentWalletsWithdrawRouteDef = ApiDef<{
	key: 'payment-wallets-withdraw'
	method: 'post'
	body: {
		pin: number
		amount: number
		location: Location
	}
	response: WithdrawalEntity
}>

type PaymentWalletsSendPinResetMailRouteDef = ApiDef<{
	key: 'payment-wallets-send-pin-reset-mail'
	method: 'post'
	response: boolean
}>

type PaymentWalletsResetPinRouteDef = ApiDef<{
	key: 'payment-wallets-reset-pin'
	method: 'post'
	body: { token: string; pin: number }
	response: boolean
}>

type PaymentWalletsVerifyPinRouteDef = ApiDef<{
	key: 'payment-wallets-verify-pin'
	method: 'post'
	body: { pin: number }
	response: boolean
}>

type PaymentWalletsUpdatePinRouteDef = ApiDef<{
	key: 'payment-wallets-update-pin'
	method: 'post'
	body: { oldPin: number | null; pin: number }
	response: boolean
}>
