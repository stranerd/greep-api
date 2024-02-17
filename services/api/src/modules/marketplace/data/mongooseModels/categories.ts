import { appInstance } from '@utils/environment'
import { CategoryDbChangeCallbacks } from '../../utils/changes/categories'
import { CategoryMapper } from '../mappers/categories'
import { CategoryFromModel } from '../models/categories'

const Schema = new appInstance.dbs.mongo.Schema<CategoryFromModel>(
	{
		_id: {
			type: String,
			default: () => appInstance.dbs.mongo.Id.toString(),
		},
		title: {
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

export const Category = appInstance.dbs.mongo.use().model('MarketplaceCategory', Schema)

export const CategoryChange = appInstance.dbs.mongo.change(Category, CategoryDbChangeCallbacks, new CategoryMapper().mapFrom)
