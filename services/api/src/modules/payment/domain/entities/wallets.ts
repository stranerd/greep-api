import { BaseEntity } from 'equipped'
import { Currencies } from '../types'

export class WalletEntity extends BaseEntity {
	public readonly id: string
	public readonly userId: string
	public readonly balance: { amount: number, currency: Currencies }
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, userId, balance, createdAt, updatedAt }: WalletConstructorArgs) {
		super()
		this.id = id
		this.userId = userId
		this.balance = balance
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type WalletConstructorArgs = {
	id: string
	userId: string
	balance: { amount: number, currency: Currencies }
	createdAt: number
	updatedAt: number
}