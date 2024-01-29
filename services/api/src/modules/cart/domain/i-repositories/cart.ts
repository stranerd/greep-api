import { ICartToModel } from '@modules/cart/data/types'

export interface ICartRepository {
    create(product: ICartToModel): Promise<any | null>
    get(userId: string): Promise<any[] | null>
}