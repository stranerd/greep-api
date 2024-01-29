export interface ReferralFromModel extends ReferralToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface ReferralToModel {
	referred: string
	userId: string
}
