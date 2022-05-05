import { CronTypes } from '@stranerd/api-commons'
import { EventTypes, publishers } from '@utils/events'
import { appInstance } from '@utils/environment'

export const startJobs = async () => {
	await appInstance.job.startProcessingQueues([
		{ name: CronTypes.hourly, cron: '0 * * * *' },
		{ name: CronTypes.daily, cron: '0 0 * * *' }
	], {
		onDelayed: async (data) => {
			await publishers[EventTypes.TASKSDELAYED].publish(data)
		},
		onCron: async (type) => {
			await publishers[EventTypes.TASKSCRON].publish({ type })
		}
	})
}