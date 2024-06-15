import { UserVendorType } from '@modules/users'
import { appInstance } from '@utils/environment'
import { ProductMeta } from '../../domain/types'
import { ProductDbChangeCallbacks } from '../../utils/changes/products'
import { ProductMapper } from '../mappers/products'
import { ProductFromModel } from '../models/products'

const Schema = new appInstance.dbs.mongo.Schema<ProductFromModel>(
	{
		_id: {
			type: String,
			default: () => appInstance.dbs.mongo.Id.toString(),
		},
		title: {
			type: String,
			required: true,
		},
		price: {
			amount: {
				type: Number,
				required: true,
			},
			currency: {
				type: String,
				required: true,
			},
		},
		inStock: {
			type: Boolean,
			required: false,
			default: false,
		},
		isAddOn: {
			type: Boolean,
			required: false,
			default: false,
		},
		description: {
			type: String,
			required: false,
			default: '',
		},
		tagIds: {
			type: [String],
			required: false,
			default: () => [],
		},
		data: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: true,
			default: () => ({ type: UserVendorType.items }),
		},
		user: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: true,
		},
		banner: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: true,
		},
		meta: Object.fromEntries(
			Object.values(ProductMeta).map((key) => [
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

export const Product = appInstance.dbs.mongo.use().model('MarketplaceProduct', Schema)

export const ProductChange = appInstance.dbs.mongo.change(Product, ProductDbChangeCallbacks, new ProductMapper().mapFrom)
