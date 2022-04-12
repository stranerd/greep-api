import { CronTypes, MediaOutput } from '@stranerd/api-commons'
import { PushNotification } from '@utils/types/push'
import { TypedEmail } from '@utils/types/email'
import { appInstance } from '@utils/environment'
import { deleteUnverifiedUsers } from '@utils/modules/emails'

export enum EventTypes {
	SENDMAIL = 'SENDMAIL',
	DELETEFILE = 'DELETEFILE',
	TASKSCRON = 'TASKSCRON',
	TASKSDELAYED = 'TASKSDELAYED',
	PUSHNOTIFICATION = 'PUSHNOTIFICATION'
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
	},
	PUSHNOTIFICATION: {
		topic: typeof EventTypes.PUSHNOTIFICATION,
		data: PushNotification
	}
}

const eventBus = appInstance.eventBus

export const subscribers = {
	[EventTypes.TASKSCRON]: eventBus.createSubscriber<Events[EventTypes.TASKSCRON]>(EventTypes.TASKSCRON, async ({ type }) => {
		if (type === CronTypes.daily) await deleteUnverifiedUsers()
	})
}

export const publishers = {
	[EventTypes.SENDMAIL]: eventBus.createPublisher<Events[EventTypes.SENDMAIL]>(EventTypes.SENDMAIL),
	[EventTypes.DELETEFILE]: eventBus.createPublisher<Events[EventTypes.DELETEFILE]>(EventTypes.DELETEFILE),
	[EventTypes.TASKSCRON]: eventBus.createPublisher<Events[EventTypes.TASKSCRON]>(EventTypes.TASKSCRON),
	[EventTypes.TASKSDELAYED]: eventBus.createPublisher<Events[EventTypes.TASKSDELAYED]>(EventTypes.TASKSDELAYED),
	[EventTypes.PUSHNOTIFICATION]: eventBus.createPublisher<Events[EventTypes.PUSHNOTIFICATION]>(EventTypes.PUSHNOTIFICATION)
}