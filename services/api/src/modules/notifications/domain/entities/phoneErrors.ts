import { BaseEntity } from 'equipped'

export class PhoneErrorEntity extends BaseEntity {
	public readonly id: string
	public readonly error: string
	public readonly to: string
	public readonly content: string
	public readonly from: string
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor(data: ErrorConstructor) {
		super()
		this.id = data.id
		this.error = data.error
		this.to = data.to
		this.content = data.content
		this.from = data.from
		this.createdAt = data.createdAt
		this.updatedAt = data.updatedAt
	}
}

type ErrorConstructor = {
	id: string
	error: string
	to: string
	content: string
	from: string
	createdAt: number
	updatedAt: number
}
