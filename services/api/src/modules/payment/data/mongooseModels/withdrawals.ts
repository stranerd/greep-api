import { appInstance } from '@utils/environment'
import { WithdrawalDbChangeCallbacks } from '../../utils/changes/withdrawals'
import { WithdrawalMapper } from '../mappers/withdrawals'
import { WithdrawalFromModel } from '../models/withdrawals'

const WithdrawalSchema = new appInstance.dbs.mongo.Schema<WithdrawalFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	userId: {
		type: String,
		required: true
	},
	agentId: {
		type: String,
		required: false,
		default: null
	},
	email: {
		type: String,
		required: true
	},
	amount: {
		type: Number,
		required: true
	},
	fee: {
		type: Number,
		required: true,
		default: 0
	},
	currency: {
		type: String,
		required: true
	},
	status: {
		type: String,
		required: true
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

export const Withdrawal = appInstance.dbs.mongo.use().model<WithdrawalFromModel>('PaymentWithdrawal', WithdrawalSchema)

export const WithdrawalChange = appInstance.dbs.mongo.change(Withdrawal, WithdrawalDbChangeCallbacks, new WithdrawalMapper().mapFrom)