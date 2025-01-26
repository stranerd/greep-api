import { UserVendorType } from '@modules/users'
import { CartProductItem } from '../../domain/types'

export interface CartFromModel extends CartToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface CartToModel {
	userId: string
	vendorId: string
	vendorType: UserVendorType
	active: boolean
	packs: CartProductItem[][]
}
