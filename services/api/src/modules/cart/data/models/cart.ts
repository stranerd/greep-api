import { Schema, model } from 'mongoose'
import { ICartFromModel } from '../types'

const cartSchema = new Schema<ICartFromModel>({
	productId: String,
	userId: String,
	quantity: Number,
})
const Cart = model<ICartFromModel>('carts', cartSchema)
export default Cart
