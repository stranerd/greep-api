import { IProductToModel } from '@modules/products/data/types'

export interface IProductRepository {
    create(product: IProductToModel): Promise<any | null>
    get(): Promise<any[] | null>
}