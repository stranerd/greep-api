import { BaseEntity } from 'equipped'

export class PhoneErrorEntity extends BaseEntity<ErrorConstructorArgs> {
	constructor(data: ErrorConstructorArgs) {
		super(data)
	}
}

type ErrorConstructorArgs = {
	id: string
	error: string
	to: string
	content: string
	from: string
	createdAt: number
	updatedAt: number
}
