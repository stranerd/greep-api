import { BaseEntity } from 'equipped'
import { Currencies, RequestStatus } from '../types'

export class RequestEntity extends BaseEntity {
	public readonly id: string
	public readonly description: string
	public readonly from: string
	public readonly to: string
	public readonly status: RequestStatus
	public readonly amount: number
	public readonly currency: Currencies
	public readonly createdAt: number
	public readonly updatedAt: number

	ignoreInJSON = ['pin']

	constructor({ id, description, from, to, status, amount, currency, createdAt, updatedAt }: RequestConstructorArgs) {
		super()
		this.id = id
		this.description = description
		this.from = from
		this.to = to
		this.status = status
		this.amount = amount
		this.currency = currency
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type RequestConstructorArgs = {
	id: string
	description: string
	from: string
	to: string
	amount: number
	currency: Currencies
	status: RequestStatus
	createdAt: number
	updatedAt: number
}
