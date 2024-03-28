import { appInstance } from '@utils/environment'
import { OrderStatus } from '../../domain/types'
import { OrderDbChangeCallbacks } from '../../utils/changes/orders'
import { OrderMapper } from '../mappers/orders'
import { OrderFromModel } from '../models/orders'

const Schema = new appInstance.dbs.mongo.Schema<OrderFromModel>(
	{
		_id: {
			type: String,
			default: () => appInstance.dbs.mongo.Id.toString(),
		},
		userId: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		driverId: {
			type: String,
			required: false,
			default: null,
		},
		done: {
			type: Boolean,
			required: false,
			default: false,
		},
		status: Object.fromEntries(
			Object.values(OrderStatus).map((status) => [
				status,
				{
					type: appInstance.dbs.mongo.Schema.Types.Mixed,
					default: () => (status === OrderStatus.created ? { at: Date.now() } : null),
				},
			]),
		),
		from: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed as unknown as OrderFromModel['from'],
			required: true,
		},
		to: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed as unknown as OrderFromModel['to'],
			required: true,
		},
		data: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed as unknown as OrderFromModel['data'],
			required: true,
		},
		dropoffNote: {
			type: String,
			required: false,
			default: '',
		},
		time: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed as unknown as OrderFromModel['time'],
			required: true,
		},
		discount: {
			type: Number,
			required: false,
			default: 0,
		},
		payment: {
			type: String,
			required: true,
		},
		fee: {
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

export const Order = appInstance.dbs.mongo.use().model('MarketplaceOrder', Schema)

export const OrderChange = appInstance.dbs.mongo.change(Order, OrderDbChangeCallbacks, new OrderMapper().mapFrom)
