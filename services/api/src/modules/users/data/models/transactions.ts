import { TransactionData } from '../../domain/types'

export interface TransactionFromModel extends TransactionToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface TransactionToModel {
	driverId: string
	managerId: string
	amount: number
	description: string
	recordedAt: number
	data: TransactionData
}