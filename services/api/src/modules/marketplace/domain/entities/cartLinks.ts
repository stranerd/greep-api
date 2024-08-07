import { UserVendorType } from '@modules/users'
import { BaseEntity } from 'equipped'
import { resolvePacks } from '../../utils/carts'
import { CartProductItem } from '../types'
import { EmbeddedProduct } from './products'

type CartLinkEntityProps = {
	id: string
	active: boolean
	packs: CartProductItem[][]
	userId: string
	vendorId: string
	vendorType: UserVendorType
	createdAt: number
	updatedAt: number
}

export class CartLinkEntity extends BaseEntity<CartLinkEntityProps> {
	public products: Record<string, EmbeddedProduct | null> = {}

	constructor(data: CartLinkEntityProps) {
		super(data)
	}

	getProductIds() {
		return resolvePacks(this.packs).map((p) => p.id)
	}
}
