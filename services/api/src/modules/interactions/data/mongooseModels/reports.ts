import { appInstance } from '@utils/environment'
import { ReportDbChangeCallbacks } from '../../utils/changes/reports'
import { ReportMapper } from '../mappers/reports'
import { ReportFromModel, ReportToModel } from '../models/reports'

const ReportSchema = new appInstance.dbs.mongo.Schema<ReportFromModel>(
	{
		_id: {
			type: String,
			default: () => appInstance.dbs.mongo.Id.toString(),
		},
		user: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed as unknown as ReportToModel['user'],
			required: true,
		},
		entity: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: true,
		},
		message: {
			type: String,
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

export const Report = appInstance.dbs.mongo.use().model<ReportFromModel>('InteractionsReport', ReportSchema)

export const ReportChange = appInstance.dbs.mongo.change(Report, ReportDbChangeCallbacks, new ReportMapper().mapFrom)
