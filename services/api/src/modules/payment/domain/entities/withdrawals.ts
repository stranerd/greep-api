import { Location } from '@utils/types'
import { BaseEntity } from 'equipped'
import { Currencies, WithdrawalStatus } from '../types'

export class WithdrawalEntity extends BaseEntity<WithdrawalConstructorArgs> {
	constructor(data: WithdrawalConstructorArgs) {
		super(data)
	}

	get charged() {
		return this.amount + this.fee
	}
}

type WithdrawalConstructorArgs = {
	id: string
	userId: string
	agentId: string | null
	email: string
	amount: number
	fee: number
	currency: Currencies
	status: WithdrawalStatus
	location: Location
	createdAt: number
	updatedAt: number
}
