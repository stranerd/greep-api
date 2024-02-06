import { Schema, model } from 'mongoose'
import { ICartFromModel } from '../models/cart'

const cartSchema = new Schema<ICartFromModel>(
	{
		productId: { type: String, unique: true },
		userId: String,
		quantity: Number,
	},
	{
		timestamps: true,
	},
)

const Cart = model<ICartFromModel>('carts', cartSchema)
export default Cart
