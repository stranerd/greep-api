import { UserVendorType } from '@modules/users'
import { BaseEntity } from 'equipped'
import { PromotionData } from '../types'

type PromotionEntityProps = {
	id: string
	title: string
	description: string
	vendorIds?: string[] | null
	vendorType?: UserVendorType[] | null
	active: boolean
	data: PromotionData
	createdBy: string
	createdAt: number
	updatedAt: number
}

export class PromotionEntity extends BaseEntity<PromotionEntityProps> {
	constructor(data: PromotionEntityProps) {
		super(data)
	}
}
