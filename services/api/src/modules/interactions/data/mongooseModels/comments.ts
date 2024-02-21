import { appInstance } from '@utils/environment'
import { CommentMeta } from '../../domain/types'
import { CommentDbChangeCallbacks } from '../../utils/changes/comments'
import { CommentMapper } from '../mappers/comments'
import { CommentFromModel } from '../models/comments'

const CommentSchema = new appInstance.dbs.mongo.Schema<CommentFromModel>(
	{
		_id: {
			type: String,
			default: () => appInstance.dbs.mongo.Id.toString(),
		},
		body: {
			type: String,
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
		meta: Object.fromEntries(
			Object.values(CommentMeta).map((key) => [
				key,
				{
					type: Number,
					required: false,
					default: 0,
				},
			]),
		),
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

export const Comment = appInstance.dbs.mongo.use().model<CommentFromModel>('InteractionsComment', CommentSchema)

export const CommentChange = appInstance.dbs.mongo.change(Comment, CommentDbChangeCallbacks, new CommentMapper().mapFrom)
