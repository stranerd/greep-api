import { TransactionFromModel, TransactionToModel } from '../models/transaction'
import { TransactionEntity } from '../../domain/entities/transaction'

export class TransactionTransformer {
	fromJSON (model: TransactionFromModel) {
		const { id, managerId, driverId, amount, description, data, recordedAt, createdAt, updatedAt } = model
		return new TransactionEntity({
			id, managerId, driverId, amount, description, data, recordedAt, createdAt, updatedAt
		})
	}

	toJSON (entity: TransactionEntity): TransactionToModel {
		return {
			driverId: entity.driverId,
			managerId: entity.managerId,
			amount: entity.amount,
			description: entity.description,
			recordedAt: entity.recordedAt,
			data: entity.data
		}
	}
}
