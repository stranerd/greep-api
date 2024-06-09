export type { EmbeddedUser } from '@modules/users'

export enum InteractionEntities {
	comments = 'comments',
	products = 'products',
	orders = 'orders',
}

type BaseInteractionEntity = {
	id: string
	userId: string
}

export type InteractionEntity = BaseInteractionEntity &
	(
		| {
				type: InteractionEntities.comments
				relations: {}
		  }
		| {
				type: InteractionEntities.products
				relations: {}
		  }
		| {
				type: InteractionEntities.orders
				relations: {
					products: string[]
				}
		  }
	)

export type Interaction = Omit<InteractionEntity, 'userId' | 'relations'>

export enum CommentMeta {
	comments = 'comments',
	total = 'total',
}

export type CommentMetaType = Record<CommentMeta, number>

export enum TagMeta {
	products = 'products',
	orders = 'orders',

	total = 'total',
}

export type TagMetaType = Record<TagMeta, number>

export enum TagTypes {
	products = 'products',
}
