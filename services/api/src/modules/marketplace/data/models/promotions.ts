import { UserVendorType } from '@modules/users'
import { PromotionData } from '../../domain/types'

export interface PromotionFromModel extends PromotionToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface PromotionToModel {
	title: string
	description: string
	vendorIds?: string[] | null
	vendorType?: UserVendorType[] | null
	active: boolean
	data: PromotionData
	createdBy: string
}
