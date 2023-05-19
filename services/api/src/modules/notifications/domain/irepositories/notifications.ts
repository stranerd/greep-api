import { QueryParams, QueryResults } from 'equipped'
import { NotificationToModel } from '../../data/models/notifications'
import { NotificationEntity } from '../entities/notifications'

export interface INotificationRepository {
	find (id: string): Promise<NotificationEntity | null>

	create (data: NotificationToModel[]): Promise<NotificationEntity[]>

	markSeen (data: { userId: string, ids?: string[], seen: boolean }): Promise<void>

	deleteOldSeen (): Promise<void>

	get (query: QueryParams): Promise<QueryResults<NotificationEntity>>
}