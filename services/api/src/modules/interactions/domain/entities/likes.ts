import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { EmbeddedUser, InteractionEntity } from '../types'

export class LikeEntity extends BaseEntity<LikeConstructorArgs> {
	constructor(data: LikeConstructorArgs) {
		data.user = generateDefaultUser(data.user)
		super(data)
	}
}

type LikeConstructorArgs = {
	id: string
	value: boolean
	entity: InteractionEntity
	user: EmbeddedUser
	createdAt: number
	updatedAt: number
}
