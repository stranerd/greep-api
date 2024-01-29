import { BaseEntity } from 'equipped'
import { Currencies } from '../types'

export class WalletEntity extends BaseEntity {
	public readonly id: string
	public readonly userId: string
	public readonly pin: string | null
	public readonly balance: { amount: number; currency: Currencies }
	public readonly createdAt: number
	public readonly updatedAt: number

	ignoreInJSON = ['pin']

	constructor({ id, userId, pin, balance, createdAt, updatedAt }: WalletConstructorArgs) {
		super()
		this.id = id
		this.userId = userId
		this.pin = pin
		this.balance = balance
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	get hasPin() {
		return !!this.pin
	}
}

type WalletConstructorArgs = {
	id: string
	userId: string
	pin: string | null
	balance: { amount: number; currency: Currencies }
	createdAt: number
	updatedAt: number
}
