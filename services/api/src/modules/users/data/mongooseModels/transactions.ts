import { appInstance } from '@utils/environment'
import { TransactionMapper } from '../mappers/transactions'
import { TransactionFromModel } from '../models/transactions'

const TransactionSchema = new appInstance.dbs.mongo.Schema<TransactionFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	driverId: {
		type: String,
		required: true
	},
	managerId: {
		type: String,
		required: true
	},
	amount: {
		type: Number,
		required: true
	},
	description: {
		type: String,
		required: false,
		default: ''
	},
	data: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true
	},
	recordedAt: {
		type: Number,
		required: false,
		default: Date.now
	},
	createdAt: {
		type: Number,
		required: false,
		default: Date.now
	},
	updatedAt: {
		type: Number,
		required: false,
		default: Date.now
	}
}, { timestamps: { currentTime: Date.now }, minimize: false })

export const Transaction = appInstance.dbs.mongo.use().model<TransactionFromModel>('UsersTransaction', TransactionSchema)

export const TransactionChange = appInstance.dbs.mongo.change(Transaction, {}, new TransactionMapper().mapFrom)