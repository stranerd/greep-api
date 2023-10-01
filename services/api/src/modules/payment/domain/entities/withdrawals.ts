import { BaseEntity } from 'equipped'
import { Currencies, WithdrawalStatus } from '../types'

export class WithdrawalEntity extends BaseEntity {
	public readonly id: string
	public readonly userId: string
	public readonly email: string
	public readonly amount: number
	public readonly fee: number
	public readonly currency: Currencies
	public readonly status: WithdrawalStatus
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		id, userId, email, amount, fee, currency, status, createdAt, updatedAt
	}: WithdrawalConstructorArgs) {
		super()
		this.id = id
		this.userId = userId
		this.email = email
		this.amount = amount
		this.fee = fee
		this.currency = currency
		this.status = status
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	getChargedAmount () {
		return this.amount + this.fee
	}
}

type WithdrawalConstructorArgs = {
	id: string
	userId: string
	email: string
	amount: number
	fee: number
	currency: Currencies
	status: WithdrawalStatus
	createdAt: number
	updatedAt: number
}