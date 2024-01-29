import { appInstance } from '@utils/environment'
import { ActivityDbChangeCallbacks } from '../../utils/changes/activities'
import { ActivityMapper } from '../mappers/activities'
import { ActivityFromModel } from '../models/activities'

const ActivitySchema = new appInstance.dbs.mongo.Schema<ActivityFromModel>(
	{
		_id: {
			type: String,
			default: () => appInstance.dbs.mongo.Id.toString(),
		},
		userId: {
			type: String,
			required: true,
		},
		data: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: true,
		},
		score: {
			type: Number,
			required: true,
		},
		createdAt: {
			type: Number,
			required: false,
			default: Date.now,
		},
		updatedAt: {
			type: Number,
			required: false,
			default: Date.now,
		},
	},
	{ timestamps: { currentTime: Date.now }, minimize: false },
)

export const Activity = appInstance.dbs.mongo.use().model<ActivityFromModel>('UsersActivity', ActivitySchema)

export const ActivityChange = appInstance.dbs.mongo.change(Activity, ActivityDbChangeCallbacks, new ActivityMapper().mapFrom)
