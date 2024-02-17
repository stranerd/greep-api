import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { EmbeddedUser, InteractionEntity } from '../types'

export class ReportEntity extends BaseEntity<ReportConstructorArgs> {
	constructor(data: ReportConstructorArgs) {
		data.user = generateDefaultUser(data.user)
		super(data)
	}
}

type ReportConstructorArgs = {
	id: string
	entity: InteractionEntity
	user: EmbeddedUser
	message: string
	createdAt: number
	updatedAt: number
}
