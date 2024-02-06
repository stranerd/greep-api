import { ICartToModel } from '@modules/marketplace/data/models/cart'

export interface ICartRepository {
	create(product: ICartToModel, userId: string): Promise<any | null>
	get(userId: string): Promise<any[] | null>
	remove(productId: string, userId: string): Promise<any | null>
}
