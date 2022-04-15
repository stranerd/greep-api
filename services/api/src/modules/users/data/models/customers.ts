export interface CustomerFromModel extends CustomerToModel {
	_id: string
	trips: number
	debt: number
}

export interface CustomerToModel {
	name: string
	driverId: string
}
