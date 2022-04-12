import { CronTypes, MediaOutput } from '@stranerd/api-commons'
import { TypedEmail } from '@utils/types/email'
import { appInstance } from '@utils/environment'
import { sendMailAndCatchError } from '@utils/modules/emails'
import { GetAndDeleteAllErrors } from '@modules/emails'
import { DeleteFile } from '@modules/storage'
import { deleteUnverifiedUsers } from '@utils/modules/auth'

export enum EventTypes {
	SENDMAIL = 'SENDMAIL',
	DELETEFILE = 'DELETEFILE',
	TASKSCRON = 'TASKSCRON',
	TASKSDELAYED = 'TASKSDELAYED'
}

interface Event<Data> {
	topic: keyof typeof EventTypes;
	data: Data;
}

export interface Events extends Record<EventTypes, Event<any>> {
	SENDMAIL: {
		topic: typeof EventTypes.SENDMAIL,
		data: TypedEmail
	},
	DELETEFILE: {
		topic: typeof EventTypes.DELETEFILE,
		data: MediaOutput
	},
	TASKSCRON: {
		topic: typeof EventTypes.TASKSCRON,
		data: { type: CronTypes }
	},
	TASKSDELAYED: {
		topic: typeof EventTypes.TASKSDELAYED,
		data: any
	}
}

const eventBus = appInstance.eventBus

export const subscribers = {
	[EventTypes.SENDMAIL]: eventBus.createSubscriber<Events[EventTypes.SENDMAIL]>(EventTypes.SENDMAIL, async (data) => {
		await sendMailAndCatchError(data)
	}),
	[EventTypes.TASKSCRON]: eventBus.createSubscriber<Events[EventTypes.TASKSCRON]>(EventTypes.TASKSCRON, async (data) => {
		if (data.type === CronTypes.halfHourly) await appInstance.job.retryAllFailedJobs()
		if (data.type === CronTypes.hourly) {
			const errors = await GetAndDeleteAllErrors.execute()
			await Promise.all(
				errors.map(async (error) => {
					await sendMailAndCatchError(error as unknown as TypedEmail)
				})
			)
		}
		if (data.type === CronTypes.daily) await deleteUnverifiedUsers()
	}),
	[EventTypes.DELETEFILE]: eventBus.createSubscriber<Events[EventTypes.DELETEFILE]>(EventTypes.DELETEFILE, async (data) => {
		if (data?.path) await DeleteFile.call(data.path)
	})
}

export const publishers = {
	[EventTypes.SENDMAIL]: eventBus.createPublisher<Events[EventTypes.SENDMAIL]>(EventTypes.SENDMAIL),
	[EventTypes.DELETEFILE]: eventBus.createPublisher<Events[EventTypes.DELETEFILE]>(EventTypes.DELETEFILE),
	[EventTypes.TASKSCRON]: eventBus.createPublisher<Events[EventTypes.TASKSCRON]>(EventTypes.TASKSCRON),
	[EventTypes.TASKSDELAYED]: eventBus.createPublisher<Events[EventTypes.TASKSDELAYED]>(EventTypes.TASKSDELAYED)
}