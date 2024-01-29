import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { WithdrawalFromModel } from '../../data/models/withdrawals'
import { WithdrawalEntity } from '../../domain/entities/withdrawals'
import { processCompletedWithdrawal, processCreatedWithdrawal, processFailedWithdrawal, processInProgressWithdrawal } from '../withdrawals'
import { WithdrawalStatus } from '../../domain/types'

export const WithdrawalDbChangeCallbacks: DbChangeCallbacks<WithdrawalFromModel, WithdrawalEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(
			[
				`payment/withdrawals/${after.userId}`,
				`payment/withdrawals/${after.id}/${after.userId}`,
				...(after.id ? [`payment/withdrawals/${after.agentId}`, `payment/withdrawals/${after.id}/${after.agentId}`] : []),
			],
			after,
		)

		await processCreatedWithdrawal(after)
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated(
			[
				`payment/withdrawals/${after.userId}`,
				`payment/withdrawals/${after.id}/${after.userId}`,
				...(after.id ? [`payment/withdrawals/${after.agentId}`, `payment/withdrawals/${after.id}/${after.agentId}`] : []),
			],
			after,
		)

		if (changes.status) {
			if (before.status === WithdrawalStatus.created && after.status === WithdrawalStatus.inProgress)
				await processInProgressWithdrawal(after)
			if (before.status === WithdrawalStatus.inProgress && after.status === WithdrawalStatus.failed)
				await processFailedWithdrawal(after)
			if (before.status === WithdrawalStatus.inProgress && after.status === WithdrawalStatus.completed)
				await processCompletedWithdrawal(after)
		}
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(
			[
				`payment/withdrawals/${before.userId}`,
				`payment/withdrawals/${before.id}/${before.userId}`,
				...(before.id ? [`payment/withdrawals/${before.agentId}`, `payment/withdrawals/${before.id}/${before.agentId}`] : []),
			],
			before,
		)
	},
}
