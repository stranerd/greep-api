import { appInstance } from '@utils/environment'
import { CartLinkDbChangeCallbacks } from '../../utils/changes/cartLinks'
import { CartLinkMapper } from '../mappers/cartLinks'
import { CartLinkFromModel } from '../models/cartLinks'

const Schema = new appInstance.dbs.mongo.Schema<CartLinkFromModel>(
	{
		_id: {
			type: String,
			default: () => appInstance.dbs.mongo.Id.toString(),
		},
		products: {
			type: [appInstance.dbs.mongo.Schema.Types.Mixed as unknown] as CartLinkFromModel['products'],
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
