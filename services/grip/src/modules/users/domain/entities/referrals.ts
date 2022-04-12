import { BaseEntity } from '@stranerd/api-commons'

export class ReferralEntity extends BaseEntity {
	public readonly id: string
	public readonly referred: string
	public readonly userId: string
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, referred, userId, createdAt, updatedAt }: ReferralConstructorArgs) {
		super()
		this.id = id
		this.referred = referred
		this.userId = userId
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type ReferralConstructorArgs = {
	id: string, referred: string, userId: string,
	createdAt: number, updatedAt: number
}
