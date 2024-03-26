import { CartsUseCases, OrderPayment, OrdersUseCases } from '@modules/marketplace'
import { ActivityEntity, ActivityType, UsersUseCases } from '@modules/users'
import { BadRequestError, NotAuthorizedError, NotFoundError, QueryKeys, QueryParams, Request, Schema, validate } from 'equipped'

export class CartsController {
	static async get(req: Request) {
		const query = req.query as QueryParams
		query.authType = QueryKeys.and
		query.auth = [{ field: 'userId', value: req.authUser!.id }]
		return await CartsUseCases.get(query)
	}

	static async find(req: Request) {
		const cart = await CartsUseCases.find(req.params.id)
		if (!cart || cart.userId !== req.authUser!.id) throw new NotFoundError()
		return cart
	}

	static async add(req: Request) {
		const data = validate(
			{
				productId: Schema.string().min(1),
				quantity: Schema.number(),
				add: Schema.boolean(),
			},
			req.body,
		)

		return await CartsUseCases.add({ ...data, userId: req.authUser!.id })
	}

	static async checkout(req: Request) {
		const data = validate(
			{
				location: Schema.object({
					coords: Schema.tuple([Schema.number(), Schema.number()]).nullable().default(null),
					location: Schema.string().min(1),
					description: Schema.string().min(1),
				}),
				dropoffNote: Schema.string(),
				time: Schema.object({
					date: Schema.time().min(Date.now()).asStamp(),
					time: Schema.string().custom((value) => {
						const [hours, minutes] = value.split(':').map((v) => parseInt(v))
						return [hours >= 0 && hours <= 23, minutes >= 0 && minutes <= 59].every(Boolean)
					}),
				}),
				discount: Schema.number().gte(0).lte(100),
				payment: Schema.in(Object.values(OrderPayment)),
			},
			req.body,
		)

		const cart = await CartsUseCases.find(req.params.id)
		if (!cart || cart.userId !== req.authUser!.id) throw new NotAuthorizedError()

		const user = await UsersUseCases.find(cart.userId)
		if (!user || user.isDeleted()) throw new BadRequestError('profile not found')
		const vendor = await UsersUseCases.find(cart.vendorId)
		if (!vendor || user.isDeleted() || !vendor.account.vendorLocation) throw new BadRequestError('vendor not found')

		const score = ActivityEntity.getScore({ type: ActivityType.orderDiscount, discount: data.discount, orderId: '' })
		if (user.account.rankings.overall.value + score < 0) throw new BadRequestError('not enough points for this discount')

		return await OrdersUseCases.checkout({
			...data,
			pickupLocation: vendor.account.vendorLocation,
			userId: user.id,
			email: user.bio.email,
			cartId: cart.id,
		})
	}

	async clear(req: Request) {
		const updatedCart = await CartsUseCases.clear({ id: req.params.id, userId: req.authUser!.id })
		if (updatedCart) return updatedCart
		throw new NotAuthorizedError()
	}
}
