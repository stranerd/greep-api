export interface CustomerFromModel extends CustomerToModel {
	id: string
	name: string
	driverId: string
	trips: number
	debt: number
	createdAt: number
	updatedAt: number
}

export type CustomerToModel = Record<string, unknown>
