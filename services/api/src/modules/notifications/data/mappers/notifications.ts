import { BaseMapper } from 'equipped'
import { NotificationEntity } from '../../domain/entities/notifications'
import { NotificationFromModel, NotificationToModel } from '../models/notifications'

export class NotificationMapper extends BaseMapper<NotificationFromModel, NotificationToModel, NotificationEntity> {
	mapFrom (param: NotificationFromModel | null) {
		return !param ? null : new NotificationEntity({
			id: param._id.toString(),
			title: param.title,
			body: param.body,
			data: param.data,
			userId: param.userId,
			seen: param.seen,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt
		})
	}

	mapTo (param: NotificationEntity) {
		return {
			title: param.title,
			body: param.body,
			data: param.data,
			userId: param.userId
		}
	}
}