import { Currencies, RequestStatus } from '../../domain/types'

export interface RequestFromModel extends RequestToModel {
	_id: string
	status: RequestStatus
	createdAt: number
	updatedAt: number
}

export interface RequestToModel {
	description: string
	from: string
	to: string
	amount: number
	currency: Currencies
}
