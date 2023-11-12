import { NotificationType, sendNotification } from '@modules/notifications'
import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { RequestFromModel } from '../../data/models/requests'
import { RequestEntity } from '../../domain/entities/requests'
import { RequestStatus } from '../../domain/types'

export const RequestDbChangeCallbacks: DbChangeCallbacks<RequestFromModel, RequestEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			`payment/requests/${after.from}`, `payment/requests/${after.to}`,
			`payment/requests/${after.id}/${after.from}`, `payment/requests/${after.id}/${after.to}`,
		], after)
	},
	updated: async ({ after, changes }) => {
		await appInstance.listener.updated([
			`payment/requests/${after.from}`, `payment/requests/${after.to}`,
			`payment/requests/${after.id}/${after.from}`, `payment/requests/${after.id}/${after.to}`,
		], after)

		if (changes.status && [RequestStatus.paid, RequestStatus.rejected].includes(after.status)) {
			const isPaid = after.status === RequestStatus.paid
			await sendNotification([after.from], {
				title: `Payment Request ${isPaid ? 'Paid' : 'Rejected'}`,
				body: `Your payment request of ${after.amount} ${after.currency} has been ${isPaid ? 'paid' : 'rejected'}.`,
				sendEmail: true,
				data: {
					type: isPaid ? NotificationType.RequestPaid : NotificationType.RequestRejected,
					requestId: after.id,
					amount: after.amount,
					currency: after.currency
				}
			})
		}

		if (changes.status && after.status === RequestStatus.acknowledged) {
			await sendNotification([after.to], {
				title: 'Payment Request Acknowledged',
				body: `Your payment request of ${after.amount} ${after.currency} has been acknowledged.`,
				sendEmail: true,
				data: {
					type: NotificationType.RequestAcknowledged,
					requestId: after.id,
					amount: after.amount,
					currency: after.currency
				}
			})
		}
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted([
			`payment/requests/${before.from}`, `payment/requests/${before.to}`,
			`payment/requests/${before.id}/${before.from}`, `payment/requests/${before.id}/${before.to}`,
		], before)
	}
}