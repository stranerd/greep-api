import { CronTypes, Email } from 'equipped'
import { appInstance } from '@utils/environment'
import { EmailErrorsUseCases, sendMailAndCatchError } from '@modules/notifications'
import { deleteUnverifiedUsers } from '@modules/auth'

export const startJobs = async () => {
	await appInstance.job.startProcessingQueues([
		{ name: CronTypes.hourly, cron: '0 * * * *' },
		{ name: CronTypes.daily, cron: '0 0 * * *' },
		{ name: CronTypes.weekly, cron: '0 0 * * SUN' },
		{ name: CronTypes.monthly, cron: '0 0 1 * *' }
	], {
		onDelayed: async () => {
		},
		onCronLike: async () => {
		},
		onCron: async (type) => {
			if (type === CronTypes.hourly) {
				const errors = await EmailErrorsUseCases.getAndDeleteAll()
				await Promise.all(
					errors.map(async (error) => {
						await sendMailAndCatchError(error as unknown as Email)
					})
				)
				await appInstance.job.retryAllFailedJobs()
			}
			if (type === CronTypes.daily) await deleteUnverifiedUsers()
		}
	})
}