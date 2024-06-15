export type { EmbeddedUser } from '@modules/users'

export enum InteractionEntities {
	comments = 'comments',
	products = 'products',
	vendors = 'vendors',
}

export type InteractionEntity = {
	id: string
	userId: string
	type: InteractionEntities
}

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
