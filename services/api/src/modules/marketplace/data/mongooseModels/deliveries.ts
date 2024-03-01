import { appInstance } from '@utils/environment'
import { DeliveryStatus } from '../../domain/types'
import { DeliveryDbChangeCallbacks } from '../../utils/changes/deliveries'
import { DeliveryMapper } from '../mappers/deliveries'
import { DeliveryFromModel } from '../models/deliveries'

const Deliverieschema = new appInstance.dbs.mongo.Schema<DeliveryFromModel>(
	{
		_id: {
			type: String,
			default: () => appInstance.dbs.mongo.Id.toString(),
		},
		userId: {
			type: String,
			required: true,
		},
		driverId: {
			type: String,
			required: false,
			default: null,
		},
		status: {
			type: String,
			required: false,
			default: DeliveryStatus.created,
		},
		from: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: true,
		},
		to: {
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

export const Delivery = appInstance.dbs.mongo.use().model<DeliveryFromModel>('MarketplaceDelivery', Deliverieschema)

export const DeliveryChange = appInstance.dbs.mongo.change(Delivery, DeliveryDbChangeCallbacks, new DeliveryMapper().mapFrom)
