import { generateDefaultUser } from '@modules/users'
import { BaseEntity, MediaOutput } from 'equipped'
import { EmbeddedUser, InteractionEntity } from '../types'

export class MediaEntity extends BaseEntity<MediaConstructorArgs> {
	constructor(data: MediaConstructorArgs) {
		data.user = generateDefaultUser(data.user)
		super(data)
	}
}

type MediaConstructorArgs = {
	id: string
	file: MediaOutput
	entity: InteractionEntity
	user: EmbeddedUser
	createdAt: number
	updatedAt: number
}
