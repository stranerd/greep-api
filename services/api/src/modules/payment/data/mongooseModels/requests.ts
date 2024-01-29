import { appInstance } from '@utils/environment'
import { Currencies, RequestStatus } from '../../domain/types'
import { RequestDbChangeCallbacks } from '../../utils/changes/requests'
import { RequestMapper } from '../mappers/requests'
import { RequestFromModel } from '../models/requests'

const RequestSchema = new appInstance.dbs.mongo.Schema<RequestFromModel>(
	{
		_id: {
			type: String,
			default: () => appInstance.dbs.mongo.Id.toString(),
		},
		from: {
			type: String,
			required: true,
		},
		to: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: false,
			default: '',
		},
		amount: {
			type: Number,
			required: true,
		},
		currency: {
			type: String,
			required: false,
			default: Currencies.TRY,
		},
		status: {
			type: String,
			required: false,
			default: RequestStatus.created,
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

export const Request = appInstance.dbs.mongo.use().model<RequestFromModel>('PaymentRequest', RequestSchema)

export const RequestChange = appInstance.dbs.mongo.change(Request, RequestDbChangeCallbacks, new RequestMapper().mapFrom)
