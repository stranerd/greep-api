import { appInstance } from '@utils/environment'
import { TagMeta } from '../../domain/types'
import { TagDbChangeCallbacks } from '../../utils/changes/tags'
import { TagMapper } from '../mappers/tags'
import { TagFromModel } from '../models/tags'

const Schema = new appInstance.dbs.mongo.Schema<TagFromModel>(
	{
		_id: {
			type: String,
			default: () => appInstance.dbs.mongo.Id.toString(),
		},
		type: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		parent: {
			type: String,
			required: false,
			default: null,
		},
		meta: Object.fromEntries(
			Object.values(TagMeta).map((key) => [
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

export const Tag = appInstance.dbs.mongo.use().model<TagFromModel>('InteractionsTag', Schema)

export const TagChange = appInstance.dbs.mongo.change(Tag, TagDbChangeCallbacks, new TagMapper().mapFrom)
