export type Offer = {
	id: string
	active: boolean
	image: string
	data: {
		type: 'delivery-discount'
		discountPercentage: number
		vendors?: string[]
	}
}

export const offers: Offer[] = []
