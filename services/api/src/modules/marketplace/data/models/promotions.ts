import { UserVendorType } from '@modules/users'
import { MediaOutput } from 'equipped'
import { PromotionData, PromotionValidity } from '../../domain/types'

export interface PromotionFromModel extends PromotionToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface PromotionToModel {
	title: string
	description: string
	vendorIds: string[] | null
	vendorType: UserVendorType[] | null
	data: PromotionData
	createdBy: string
	banner: MediaOutput
	validity: PromotionValidity | null
}
