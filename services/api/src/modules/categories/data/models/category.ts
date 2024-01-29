import { Schema, model } from 'mongoose'
import { ICategoryFromModel } from '../types'

const categorySchema = new Schema<ICategoryFromModel>({
	category: { type: String, required: true },
})

const Category = model<ICategoryFromModel>('Category', categorySchema)

export default Category
