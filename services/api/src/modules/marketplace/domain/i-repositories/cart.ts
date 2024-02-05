import { ICartToModel } from '@modules/marketplace/data/models/cart'

export interface ICartRepository {
    create(product: ICartToModel): Promise<any | null>
    get(userId: string): Promise<any[] | null>
}