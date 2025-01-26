import { BaseEntity } from 'equipped'

export class TokenEntity extends BaseEntity<TokenConstructorArgs> {
	constructor(data: TokenConstructorArgs) {
		super(data)
	}
}

type TokenConstructorArgs = {
	id: string
	tokens: string[]
	userId: string
	createdAt: number
	updatedAt: number
}
