import { BaseEntity } from 'equipped'
import { TagMetaType, TagTypes } from '../types'

export class TagEntity extends BaseEntity<TagConstructorArgs> {
	constructor(data: TagConstructorArgs) {
		super(data)
	}

	isProducts() {
		return this.type === TagTypes.products
	}
}

type TagConstructorArgs = {
	id: string
	type: TagTypes
	title: string
	parent: string | null
	meta: TagMetaType
	createdAt: number
	updatedAt: number
}
