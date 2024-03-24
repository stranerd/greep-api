export type { EmbeddedUser } from '@modules/users'

export enum InteractionEntities {
	comments = 'comments',
	products = 'products',
}

export type Interaction = {
	type: InteractionEntities
	id: string
}

export type InteractionEntity = Interaction & { userId: string }

export enum CommentMeta {
	comments = 'comments',
	total = 'total',
}

export type CommentMetaType = Record<CommentMeta, number>

export enum TagMeta {
	products = 'products',

	total = 'total',
}

export type TagMetaType = Record<TagMeta, number>

export enum TagTypes {
	products = 'products',
}
