import { appInstance } from '@utils/environment'
import { OrderDbChangeCallbacks } from '../../utils/changes/orders'
import { OrderMapper } from '../mappers/orders'
import { OrderFromModel } from '../models/orders'

const Schema = new appInstance.dbs.mongo.Schema<OrderFromModel>(
	{
		_id: {
			type: String,
			default: () => appInstance.dbs.mongo.Id.toString(),
		},
		products: {
			type: [appInstance.dbs.mongo.Schema.Types.Mixed as unknown] as OrderFromModel['products'],
			required: false,
			default: [],
		},
		userId: {
			type: String,
			required: true,
		},
		cartId: {
			type: String,
			required: true,
		},
		vendorId: {
			type: String,
			required: true,
		},
		location: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed as unknown as OrderFromModel['location'],
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
		price: {
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
