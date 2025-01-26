import { BaseEntity } from 'equipped'
import { TransactionData } from '../types'

export class TransactionEntity extends BaseEntity<TransactionConstructorArgs> {
	constructor(data: TransactionConstructorArgs) {
		super(data)
	}
}

type TransactionConstructorArgs = {
	id: string
	createdAt: number
	updatedAt: number
	recordedAt: number
	driverId: string
	amount: number
	description: string
	data: TransactionData
}
