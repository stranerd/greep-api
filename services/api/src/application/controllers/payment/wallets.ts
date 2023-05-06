import { WalletsUseCases } from '@modules/payment'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, Request, Schema, validate } from 'equipped'

export class WalletsController {
	static async get (req: Request) {
		return await WalletsUseCases.get(req.authUser!.id)
	}

	static async transfer (req: Request) {
		const authUser = req.authUser!

		const { amount, to, note } = validate({
			amount: Schema.number().gt(0),
			to: Schema.string().min(1),
			note: Schema.string(),
		}, req.body)

		const user = await UsersUseCases.find(to)
		if (!user) throw new BadRequestError('user not found')

		return await WalletsUseCases.transfer({
			from: authUser.id, fromEmail: authUser.email,
			to: user.id, toEmail: user.bio.email,
			amount, note
		})
	}
}