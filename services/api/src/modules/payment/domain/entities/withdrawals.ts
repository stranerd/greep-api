import { Location } from '@utils/types'
import { BaseEntity } from 'equipped'
import { Currencies, WithdrawalStatus } from '../types'

export class WithdrawalEntity extends BaseEntity {
	public readonly id: string
	public readonly userId: string
	public readonly agentId: string | null
	public readonly email: string
	public readonly amount: number
	public readonly fee: number
	public readonly currency: Currencies
	public readonly status: WithdrawalStatus
	public readonly location: Location
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({ id, userId, agentId, email, amount, location, fee, currency, status, createdAt, updatedAt }: WithdrawalConstructorArgs) {
		super()
		this.id = id
		this.userId = userId
		this.agentId = agentId
		this.email = email
		this.amount = amount
		this.fee = fee
		this.currency = currency
		this.status = status
		this.location = location
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	getChargedAmount() {
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
