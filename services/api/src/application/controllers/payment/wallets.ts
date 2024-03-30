import { Currencies, WalletsUseCases } from '@modules/payment'
import { UsersUseCases } from '@modules/users'
import { LocationSchema } from '@utils/types'
import { BadRequestError, Request, Schema, ValidationError, validate } from 'equipped'

export class WalletsController {
	static async get(req: Request) {
		return await WalletsUseCases.get(req.authUser!.id)
	}

	static async transfer(req: Request) {
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
	}

	static async withdraw(req: Request) {
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
	}

	static async sendPinResetMail(req: Request) {
		return await WalletsUseCases.sendPinResetMail({
			userId: req.authUser!.id,
			email: req.authUser!.email,
		})
	}

	static async resetPin(req: Request) {
		const { token, pin } = validate(
			{
				token: Schema.force.string(),
				pin: Schema.string().min(4).max(4),
			},
			req.body,
		)

		return await WalletsUseCases.resetPin({ userId: req.authUser!.id, token, pin })
	}

	static async updatePin(req: Request) {
		const { oldPin, pin } = validate(
			{
				oldPin: Schema.string().nullable().default(null),
				pin: Schema.string().min(4).max(4),
			},
			req.body,
		)

		return await WalletsUseCases.updatePin({ userId: req.authUser!.id, oldPin, pin })
	}

	static async verifyPin(req: Request) {
		const wallet = await WalletsUseCases.get(req.authUser!.id)
		if (!wallet.pin) throw new ValidationError([{ field: 'pin', messages: ['pin is not set'] }])

		const { pin } = validate(
			{
				pin: Schema.string(),
			},
			req.body,
		)

		return wallet.pin === pin
	}
}
