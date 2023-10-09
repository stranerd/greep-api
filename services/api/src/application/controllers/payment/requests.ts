import { Currencies, RequestsUseCases, WalletsUseCases } from '@modules/payment'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, NotAuthorizedError, NotFoundError, QueryKeys, QueryParams, Request, Schema, validate } from 'equipped'

export class RequestsController {
	static async find (req: Request) {
		const request = await RequestsUseCases.find(req.params.id)
		if (!request || (request.from !== req.authUser!.id && request.to !== req.authUser!.id)) throw new NotFoundError()
		return request
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'from', value: req.authUser!.id }, { field: 'to', value: req.authUser!.id }]
		query.authType = QueryKeys.or
		return await RequestsUseCases.get(query)
	}

	static async create (req: Request) {
		const data = validate({
			description: Schema.string().min(1),
			to: Schema.string().min(1).ne(req.authUser!.id, (val, comp) => val === comp, 'cannot send request to yourself'),
			amount: Schema.number().gt(0),
			currency: Schema.in(Object.values(Currencies)).default(Currencies.TRY)
		}, req.body)

		const to = await UsersUseCases.find(data.to)
		if (!to || to.isDeleted()) throw new NotFoundError('user not found')

		return await RequestsUseCases.create({
			...data, from: req.authUser!.id,
		})
	}

	static async reject (req: Request) {
		const updated = await RequestsUseCases.accept({ id: req.params.id, userId: req.authUser!.id, value: false })
		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async accept (req: Request) {
		const authUser = req.authUser!
		const request = await RequestsUseCases.find(req.params.id)
		if (!request || request.to !== req.authUser!.id) throw new NotAuthorizedError()

		const data = validate({ payWithWallet: Schema.boolean() }, req.body)

		if (data.payWithWallet) {
			const user = await UsersUseCases.find(request.from)
			if (!user || user.isDeleted()) throw new BadRequestError('user not found')
			const transferred = await WalletsUseCases.transfer({
				from: authUser.id, fromEmail: authUser.email, fromName: authUser.username,
				to: user.id, toEmail: user.bio.email, toName: user.bio.username,
				amount: request.amount, note: request.description
			})
			if (!transferred) throw new BadRequestError('transfer failed')
		}

		const updated = await RequestsUseCases.accept({ id: request.id, userId: req.authUser!.id, value: true })
		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async acknowledge (req: Request) {
		const updated = RequestsUseCases.acknowledge({ id: req.params.id, userId: req.authUser!.id, value: true })
		if (updated) return updated
		throw new NotAuthorizedError()
	}
}