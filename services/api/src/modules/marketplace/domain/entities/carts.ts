import { UserVendorType } from '@modules/users'
import { BaseEntity } from 'equipped'
import { resolvePacks } from '../../utils/carts'
import { CartProductItem } from '../types'
import { EmbeddedProduct } from './products'

type CartEntityProps = {
	id: string
	active: boolean
	packs: CartProductItem[][]
	userId: string
	vendorId: string
	vendorType: UserVendorType
	createdAt: number
	updatedAt: number
}

export class CartEntity extends BaseEntity<CartEntityProps> {
	public products: Record<string, EmbeddedProduct | null> = {}

	constructor(data: CartEntityProps) {
		super(data)
	}

	getProductIds() {
		return resolvePacks(this.packs).map((p) => p.id)
	}
}
