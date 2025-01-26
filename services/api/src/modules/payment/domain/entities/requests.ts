import { BaseEntity } from 'equipped'
import { Currencies, RequestStatus } from '../types'

export class RequestEntity extends BaseEntity<RequestConstructorArgs> {
	constructor(data: RequestConstructorArgs) {
		super(data)
	}
}

type RequestConstructorArgs = {
	id: string
	description: string
	from: string
	to: string
	amount: number
	currency: Currencies
	status: RequestStatus
	createdAt: number
	updatedAt: number
}
