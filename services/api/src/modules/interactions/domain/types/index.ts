export type { EmbeddedUser } from '@modules/users'

export enum InteractionEntities {
	comments = 'comments',
	products = 'products',
	vendors = 'vendors',
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
				relations: {
					orderId?: string
				}
		  }
		| {
				type: InteractionEntities.vendors
				relations: {
					orderId?: string
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
	productsItems = 'productsItems',
	productsFoods = 'productsFoods',
	orders = 'orders',

	total = 'total',
}

export type TagMetaType = Record<TagMeta, number>

export enum TagTypes {
	productsItems = 'productsItems',
	productsFoods = 'productsFoods',
}
