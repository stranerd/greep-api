import { BaseEntity } from '@stranerd/api-commons'
import { TransactionData } from '../types'

export class TransactionEntity extends BaseEntity {
	public readonly id: string
	public readonly driverId: string
	public readonly managerId: string
	public readonly amount: number
	public readonly description: string
	public readonly data: TransactionData
	public readonly recordedAt: number
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		             id,
		             driverId,
		             managerId,
		             amount,
		             description,
		             data,
		             recordedAt,
		             createdAt,
		             updatedAt
	             }: TransactionConstructorArgs) {
		super()
		this.id = id
		this.driverId = driverId
		this.managerId = managerId
		this.amount = amount
		this.description = description
		this.data = data
		this.recordedAt = recordedAt
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type TransactionConstructorArgs = {
	id: string, createdAt: number, updatedAt: number, recordedAt: number,
	driverId: string, managerId: string, amount: number, description: string, data: TransactionData
}
