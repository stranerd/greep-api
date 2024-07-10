import { BaseEntity, MediaOutput } from 'equipped'
import { TagMetaType, TagTypes } from '../types'

export class TagEntity extends BaseEntity<TagConstructorArgs> {
	constructor(data: TagConstructorArgs) {
		super(data)
	}
}

type TagConstructorArgs = {
	id: string
	type: TagTypes
	title: string
	parent: string | null
	photo: MediaOutput | null
	meta: TagMetaType
	createdAt: number
	updatedAt: number
}
