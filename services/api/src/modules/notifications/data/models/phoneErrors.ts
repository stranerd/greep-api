export interface PhoneErrorFromModel extends PhoneErrorToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface PhoneErrorToModel {
	error: string
	to: string
	content: string
	from: string
}