import { CronTypes, Email } from '@stranerd/api-commons'
import { appInstance } from '@utils/environment'
import { EmailsUseCases } from '@modules/emails'
import { sendMailAndCatchError } from '@utils/modules/emails'
import { deleteUnverifiedUsers } from '@utils/modules/auth'

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
				const errors = await EmailsUseCases.getAndDeleteAllErrors()
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