import { TransactionData, TransactionType } from '../types'
import { BaseEntity } from '@modules/core'

type TransactionConstructorArgs = {
	id: string
	driverId: string
	managerId: string
	amount: number
	description: string
	data: TransactionData
	recordedAt: number
	createdAt: number
	updatedAt: number
}

export class TransactionEntity extends BaseEntity {
	public readonly id: string
	public readonly managerId: string
	public readonly driverId: string
	public readonly amount: number
	public readonly description: string
	public readonly data: TransactionData
	public readonly recordedAt: number
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		             id, managerId, driverId, amount, description, data, recordedAt, createdAt, updatedAt
	             }: TransactionConstructorArgs) {
		super()
		this.id = id
		this.managerId = managerId
		this.driverId = driverId
		this.amount = amount
		this.description = description
		this.data = data
		this.recordedAt = recordedAt
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	get isTrip () {
		return this.data.type === TransactionType.trip
	}

	get isExpense () {
		return this.data.type === TransactionType.expense
	}

	get isBalance () {
		return this.data.type === TransactionType.balance
	}
}
