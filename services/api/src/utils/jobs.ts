import { deleteUnverifiedUsers } from '@modules/auth'
import {
	EmailErrorsUseCases,
	NotificationsUseCases,
	PhoneErrorsUseCases,
	sendMailAndCatchError,
	sendTextAndCatchError,
} from '@modules/notifications'
import { processTransactions, processWithdrawals } from '@modules/payment'
import { UserRankings, UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/environment'
import { CronTypes } from 'equipped'

export const startJobs = async () => {
	await appInstance.job.startProcessingQueues(
		[
			{ name: CronTypes.hourly, cron: '0 * * * *' },
			{ name: CronTypes.daily, cron: '0 0 * * *' },
			{ name: CronTypes.weekly, cron: '0 0 * * SUN' },
			{ name: CronTypes.monthly, cron: '0 0 1 * *' },
		],
		{
			onDelayed: async () => {},
			onCronLike: async () => {},
			onCron: async (type) => {
				if (type === CronTypes.hourly) {
					const [emails, texts] = await Promise.all([
						EmailErrorsUseCases.getAndDeleteAll(),
						PhoneErrorsUseCases.getAndDeleteAll(),
					])
					await Promise.all([
						processTransactions(60 * 60 * 1000),
						processWithdrawals(60 * 60 * 1000),
						appInstance.job.retryAllFailedJobs(),
						...emails.map((e) => sendMailAndCatchError(e as any)),
						...texts.map((t) => sendTextAndCatchError(t)),
					])
				}
				if (type === CronTypes.daily) {
					await UsersUseCases.resetRankings(UserRankings.daily)
					await deleteUnverifiedUsers()
				}
				if (type === CronTypes.weekly) {
					await UsersUseCases.resetRankings(UserRankings.weekly)
					await NotificationsUseCases.deleteOldSeen()
				}
				if (type === CronTypes.monthly) {
					await UsersUseCases.resetRankings(UserRankings.monthly)
				}
			},
		},
	)
}
