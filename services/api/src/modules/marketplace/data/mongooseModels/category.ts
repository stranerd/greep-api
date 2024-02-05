import { Schema, model } from 'mongoose'
import { ICategoryFromModel } from '../models/categories'

const categorySchema = new Schema<ICategoryFromModel>({
	title: { type: String, required: true },
})

const Category = model<ICategoryFromModel>('Category', categorySchema)

export default Category
