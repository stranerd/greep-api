import { BaseEntity } from 'equipped'

export class ReferralEntity extends BaseEntity<ReferralConstructorArgs> {
	constructor(data: ReferralConstructorArgs) {
		super(data)
	}
}

type ReferralConstructorArgs = {
	id: string
	referred: string
	userId: string
	createdAt: number
	updatedAt: number
}
