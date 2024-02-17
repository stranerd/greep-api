import { appInstance } from '@utils/environment'
import { MediaDbChangeCallbacks } from '../../utils/changes/media'
import { MediaMapper } from '../mappers/media'
import { MediaFromModel } from '../models/media'

const MediaSchema = new appInstance.dbs.mongo.Schema<MediaFromModel>(
	{
		_id: {
			type: String,
			default: () => appInstance.dbs.mongo.Id.toString(),
		},
		file: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
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
		order: {
			type: Number,
			required: false,
			default: 0,
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

export const Media = appInstance.dbs.mongo.use().model<MediaFromModel>('InteractionsMedia', MediaSchema)

export const MediaChange = appInstance.dbs.mongo.change(Media, MediaDbChangeCallbacks, new MediaMapper().mapFrom)
