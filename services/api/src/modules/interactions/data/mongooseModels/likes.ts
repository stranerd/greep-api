import { appInstance } from '@utils/environment'
import { LikeDbChangeCallbacks } from '../../utils/changes/likes'
import { LikeMapper } from '../mappers/likes'
import { LikeFromModel } from '../models/likes'

const LikeSchema = new appInstance.dbs.mongo.Schema<LikeFromModel>(
	{
		_id: {
			type: String,
			default: () => appInstance.dbs.mongo.Id.toString(),
		},
		value: {
			type: Boolean,
			required: true,
		},
		entity: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: true,
		},
		user: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
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

export const Like = appInstance.dbs.mongo.use().model<LikeFromModel>('InteractionsLike', LikeSchema)

export const LikeChange = appInstance.dbs.mongo.change(Like, LikeDbChangeCallbacks, new LikeMapper().mapFrom)
