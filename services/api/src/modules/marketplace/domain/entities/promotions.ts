import { UserVendorType } from '@modules/users'
import { BaseEntity, MediaOutput } from 'equipped'
import { PromotionData, PromotionValidity } from '../types'

type PromotionEntityProps = {
	id: string
	title: string
	description: string
	vendorIds: string[] | null
	vendorType: UserVendorType[] | null
	productIds: string[] | null
	validity: PromotionValidity | null
	banner: MediaOutput
	data: PromotionData
	createdBy: string
	createdAt: number
	updatedAt: number
}

export class PromotionEntity extends BaseEntity<PromotionEntityProps> {
	constructor(data: PromotionEntityProps) {
		super(data)
	}

	get active() {
		if (!this.validity) return true
		const now = Date.now()
		return this.validity.from <= now && this.validity.to >= now
	}
}
