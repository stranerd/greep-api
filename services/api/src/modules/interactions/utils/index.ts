import { ProductsUseCases } from '@modules/marketplace'
import { BadRequestError } from 'equipped'
import { CommentsUseCases } from '..'
import { InteractionEntities, InteractionEntity } from '../domain/types'
import { UsersUseCases } from '@modules/users'

type Interactions = 'comments' | 'likes' | 'dislikes' | 'reports' | 'reviews' | 'views' | 'media'

const InteractionsMappings: Record<Interactions, InteractionEntities[]> = {
	comments: [InteractionEntities.comments],
	reviews: [InteractionEntities.products],
	media: [InteractionEntities.products],
	likes: [InteractionEntities.products, InteractionEntities.vendors],
	dislikes: [],
	reports: [],
	views: [],
}

const finders: { [K in InteractionEntities]: (id: string) => Promise<InteractionEntity | undefined> } = {
	[InteractionEntities.comments]: async (id: string) => {
		const comment = await CommentsUseCases.find(id)
		if (!comment || comment.entity.type === InteractionEntities.comments) return undefined
		return {
			type: InteractionEntities.comments,
			id: comment.id,
			userId: comment.user.id,
		}
	},
	[InteractionEntities.products]: async (id: string) => {
		const product = await ProductsUseCases.find(id)
		if (!product) return undefined
		return {
			type: InteractionEntities.products,
			id: product.id,
			userId: product.user.id,
		}
	},
	[InteractionEntities.vendors]: async (id: string) => {
		const user = await UsersUseCases.find(id)
		if (!user || !user.isVendor()) return undefined
		return {
			type: InteractionEntities.vendors,
			id: user.id,
			userId: user.id,
		}
	},
}

export const verifyInteraction = async (
	{ type, id }: { type: InteractionEntities; id: string },
	interaction: Interactions,
): Promise<InteractionEntity> => {
	const supported = InteractionsMappings[interaction]?.includes(type)
	const finder = finders[type]
	if (!supported || !finder) throw new BadRequestError(`${interaction} not supported for ${type}`)
	const entity = await finder(id)
	if (!entity) throw new BadRequestError(`no ${type} with id ${id} found`)
	return entity
}
