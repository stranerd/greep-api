import { BaseEntity } from 'equipped'
import { Currencies, TransactionData, TransactionStatus } from '../types'

export class TransactionEntity extends BaseEntity<TransactionConstructorArgs> {
	constructor(data: TransactionConstructorArgs) {
		super(data)
	}
}

type TransactionConstructorArgs = {
	id: string
	userId: string
	email: string
	title: string
	amount: number
	currency: Currencies
	status: TransactionStatus
	data: TransactionData
	createdAt: number
	updatedAt: number
}
