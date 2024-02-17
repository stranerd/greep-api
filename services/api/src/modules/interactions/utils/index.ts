import { ProductsUseCases } from '@modules/marketplace'
import { BadRequestError } from 'equipped'
import { CommentsUseCases } from '..'
import { InteractionEntities } from '../domain/types'

type Interactions = 'comments' | 'likes' | 'dislikes' | 'reports' | 'reviews' | 'views'

const finders = {
	[InteractionEntities.comments]: async (id: string) => {
		const comment = await CommentsUseCases.find(id)
		if (!comment || comment.entity.type === InteractionEntities.comments) return undefined
		return comment.user.id
	},
	[InteractionEntities.products]: async (id: string) => {
		const product = await ProductsUseCases.find(id)
		return product?.user.id
	},
}

export const verifyInteractionAndGetUserId = async (type: InteractionEntities, id: string, interaction: Interactions) => {
	const types = (() => {
		if (interaction === 'comments') return [InteractionEntities.comments]
		if (interaction === 'views') return []
		if (interaction === 'reports') return []
		if (interaction === 'reviews') return []
		return []
	})().reduce(
		(acc, cur) => {
			acc[cur] = finders[cur]
			return acc
		},
		{} as Record<InteractionEntities, (id: string) => Promise<string | undefined>>,
	)

	const finder = types[type]
	if (!finder) throw new BadRequestError(`${interaction} not supported for ${type}`)
	const res = await finder(id)
	if (!res) throw new BadRequestError(`no ${type} with id ${id} found`)
	return res
}
