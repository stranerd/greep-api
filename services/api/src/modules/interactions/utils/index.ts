import { OrdersUseCases, ProductsUseCases } from '@modules/marketplace'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, Schema } from 'equipped'
import { CommentsUseCases } from '..'
import { InteractionEntities, InteractionEntity } from '../domain/types'

type Interactions = 'comments' | 'likes' | 'dislikes' | 'reports' | 'reviews' | 'views' | 'media'

const InteractionsMappings: Record<Interactions, InteractionEntities[]> = {
	comments: [],
	reviews: [InteractionEntities.products],
	media: [],
	likes: [InteractionEntities.products, InteractionEntities.vendors],
	dislikes: [],
	reports: [],
	views: [],
}

const finders: {
	[K in InteractionEntities]: (
		data: Omit<Extract<InteractionEntity, { type: K }>, 'userId'>,
	) => Promise<Extract<InteractionEntity, { type: K }> | undefined>
} = {
	[InteractionEntities.comments]: async ({ id, relations }) => {
		const comment = await CommentsUseCases.find(id)
		if (!comment || comment.entity.type === InteractionEntities.comments) return undefined
		return {
			type: InteractionEntities.comments,
			id: comment.id,
			userId: comment.user.id,
			relations,
		}
	},
	[InteractionEntities.products]: async ({ id, relations }) => {
		const product = await ProductsUseCases.find(id)
		if (!product) return undefined
		if (relations.orderId) {
			const order = await OrdersUseCases.find(relations.orderId)
			if (!order || !order.getProductIds().includes(product.id)) return undefined
		}
		return {
			type: InteractionEntities.products,
			id: product.id,
			userId: product.user.id,
			relations,
		}
	},
	[InteractionEntities.vendors]: async ({ id, relations }) => {
		const user = await UsersUseCases.find(id)
		if (!user || !user.isVendor()) return undefined
		if (relations.orderId) {
			const order = await OrdersUseCases.find(relations.orderId)
			if (!order || order.getVendor() !== user.id) return undefined
		}
		return {
			type: InteractionEntities.vendors,
			id: user.id,
			userId: user.id,
			relations,
		}
	},
}

export const verifyInteraction = async (
	baseEntity: Omit<InteractionEntity, 'userId'>,
	interaction: Interactions,
): Promise<InteractionEntity> => {
	const supported = InteractionsMappings[interaction]?.includes(baseEntity.type)
	const finder = finders[baseEntity.type]
	if (!supported || !finder) throw new BadRequestError(`${interaction} not supported for ${baseEntity.type}`)
	const entity = await finder(baseEntity as any)
	if (!entity) throw new BadRequestError(`no ${baseEntity.type} with id ${baseEntity.id} found`)
	return entity
}

export const EntitySchema = () =>
	Schema.discriminate((entity) => entity.type, {
		[InteractionEntities.comments]: Schema.object({
			id: Schema.string(),
			type: Schema.is(InteractionEntities.comments as const),
			relations: Schema.object({}),
		}),
		[InteractionEntities.products]: Schema.object({
			id: Schema.string(),
			type: Schema.is(InteractionEntities.products as const),
			relations: Schema.object({
				orderId: Schema.string().optional(),
			}),
		}),
		[InteractionEntities.vendors]: Schema.object({
			id: Schema.string(),
			type: Schema.is(InteractionEntities.vendors as const),
			relations: Schema.object({
				orderId: Schema.string().optional(),
			}),
		}),
	})
