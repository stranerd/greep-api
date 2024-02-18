import { appInstance } from '@utils/environment'
import { CartDbChangeCallbacks } from '../../utils/changes/carts'
import { CartMapper } from '../mappers/carts'
import { CartFromModel } from '../models/carts'

const Schema = new appInstance.dbs.mongo.Schema<CartFromModel>(
	{
		_id: {
			type: String,
			default: () => appInstance.dbs.mongo.Id.toString(),
		},
		products: {
			type: [appInstance.dbs.mongo.Schema.Types.Mixed as unknown] as CartFromModel['products'],
			required: false,
			default: [],
		},
		userId: {
			type: String,
			required: true,
		},
		vendorId: {
			type: String,
			required: true,
		},
		active: {
			type: Boolean,
			required: false,
			default: true,
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

export const Cart = appInstance.dbs.mongo.use().model('MarketplaceCart', Schema)

export const CartChange = appInstance.dbs.mongo.change(Cart, CartDbChangeCallbacks, new CartMapper().mapFrom)
