import { TagMetaType, TagTypes } from '../../domain/types'

export interface TagFromModel extends TagToModel {
	_id: string
	meta: TagMetaType
	createdAt: number
	updatedAt: number
}

export interface TagToModel {
	type: TagTypes
	title: string
	parent: string | null
}
