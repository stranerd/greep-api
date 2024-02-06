import { ICartToModel } from '@modules/marketplace/data/models/cart'

export interface ICategoryRepository {
	createCategory(data: ICartToModel): Promise<any | null>
	getAllCategories(): Promise<any[] | null>
	get(category: string): Promise<any | null>
}
