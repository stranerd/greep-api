import { appInstance } from '@utils/environment'
import { ViewDbChangeCallbacks } from '../../utils/changes/views'
import { ViewMapper } from '../mappers/views'
import { ViewFromModel } from '../models/views'

const ViewSchema = new appInstance.dbs.mongo.Schema<ViewFromModel>(
	{
		_id: {
			type: String,
			default: () => appInstance.dbs.mongo.Id.toString(),
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

export const View = appInstance.dbs.mongo.use().model<ViewFromModel>('InteractionsView', ViewSchema)

export const ViewChange = appInstance.dbs.mongo.change(View, ViewDbChangeCallbacks, new ViewMapper().mapFrom)
