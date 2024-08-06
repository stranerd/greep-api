import { UserVendorType } from '@modules/users'

export type Offer = {
	id: string
	active: boolean
	image: string
	vendors: string[] | null
	vendorType: UserVendorType[] | null
	data: {
		type: 'delivery-discount'
		discountPercentage: number
	}
}

export const offers: Offer[] = []
