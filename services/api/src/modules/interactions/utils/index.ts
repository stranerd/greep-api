import { OrdersUseCases, ProductsUseCases } from '@modules/marketplace'
import { BadRequestError } from 'equipped'
import { CommentsUseCases } from '..'
import { InteractionEntities, InteractionEntity } from '../domain/types'

type Interactions = 'comments' | 'likes' | 'dislikes' | 'reports' | 'reviews' | 'views' | 'media'

const InteractionsMappings: Record<Interactions, InteractionEntities[]> = {
	comments: [InteractionEntities.comments],
	reviews: [InteractionEntities.orders],
	media: [InteractionEntities.products],
	likes: [],
	dislikes: [],
	reports: [],
	views: [],
}

const finders: { [K in InteractionEntities]: (id: string) => Promise<Extract<InteractionEntity, { type: K }> | undefined> } = {
	[InteractionEntities.comments]: async (id: string) => {
		const comment = await CommentsUseCases.find(id)
		if (!comment || comment.entity.type === InteractionEntities.comments) return undefined
		return {
			type: InteractionEntities.comments,
			id: comment.id,
			userId: comment.user.id,
			relations: {},
		}
	},
	[InteractionEntities.products]: async (id: string) => {
		const product = await ProductsUseCases.find(id)
		if (!product) return undefined
		return {
			type: InteractionEntities.products,
			id: product.id,
			userId: product.user.id,
			relations: {},
		}
	},
	[InteractionEntities.orders]: async (id) => {
		const order = await OrdersUseCases.find(id)
		if (!order) return undefined
		return {
			type: InteractionEntities.orders,
			id: order.id,
			userId: order.userId,
			relations: {
				products: order.getProducts().map((product) => product.id),
			},
		}
	},
}

export const verifyInteraction = async (type: InteractionEntities, id: string, interaction: Interactions): Promise<InteractionEntity> => {
	const supported = InteractionsMappings[interaction]?.includes(type)
	const finder = finders[type]
	if (!supported || !finder) throw new BadRequestError(`${interaction} not supported for ${type}`)
	const entity = await finder(id)
	if (!entity) throw new BadRequestError(`no ${type} with id ${id} found`)
	return entity
}
