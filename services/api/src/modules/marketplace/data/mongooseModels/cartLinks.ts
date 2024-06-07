import { appInstance } from '@utils/environment'
import { CartLinkDbChangeCallbacks } from '../../utils/changes/cartLinks'
import { CartFromModel } from '../models/carts'
import { CartLinkMapper } from '../mappers/cartLinks'

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

export const CartLink = appInstance.dbs.mongo.use().model('MarketplaceCartLink', Schema)

export const CartLinkChange = appInstance.dbs.mongo.change(CartLink, CartLinkDbChangeCallbacks, new CartLinkMapper().mapFrom)
