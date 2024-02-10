import { Schema, model } from 'mongoose'
import { IProductFromModel } from '../models/product'

const productSchema = new Schema<IProductFromModel>(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		price: { type: Number, required: true },
		quantity: { type: Number, required: true },
		images: [
			{
				type: String,
			},
		],
		categories: [
			{
				type: String,
			},
		],
	},
	{
		timestamps: true,
	},
)

const Product = model<IProductFromModel>('Product', productSchema)
export default Product
