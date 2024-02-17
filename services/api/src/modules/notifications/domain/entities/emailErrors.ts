import { BaseEntity } from 'equipped'

export class EmailErrorEntity extends BaseEntity<ErrorConstructorArgs> {
	constructor(data: ErrorConstructorArgs) {
		super(data)
	}
}

type ErrorConstructorArgs = {
	id: string
	error: string
	subject: string
	to: string
	content: string
	from: string
	data: {
		attachments?: Record<string, boolean>
	}
	createdAt: number
	updatedAt: number
}
