import { UserVendorType } from '@modules/users'
import { CartProductItem } from '../../domain/types'

export interface CartLinkFromModel extends CartLinkToModel {
	_id: string
	active: boolean
	createdAt: number
	updatedAt: number
}

export interface CartLinkToModel {
	userId: string
	vendorId: string
	vendorType: UserVendorType
	packs: CartProductItem[][]
}
