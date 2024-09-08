import { appInstance } from '@utils/environment'
import { PromotionDbChangeCallbacks } from '../../utils/changes/promotions'
import { PromotionMapper } from '../mappers/promotions'
import { PromotionFromModel } from '../models/promotions'

const Schema = new appInstance.dbs.mongo.Schema<PromotionFromModel>(
	{
		_id: {
			type: String,
			default: () => appInstance.dbs.mongo.Id.toString(),
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: false,
			default: '',
		},
		vendorIds: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: false,
			default: null,
		},
		vendorType: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: false,
			default: null,
		},
		data: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: true,
		},
		banner: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: true,
		},
		validity: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: false,
			default: null,
		},
		createdBy: {
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

export const Promotion = appInstance.dbs.mongo.use().model('MarketplacePromotion', Schema)

export const PromotionChange = appInstance.dbs.mongo.change(Promotion, PromotionDbChangeCallbacks, new PromotionMapper().mapFrom)
