import { BaseEntity } from 'equipped'
import { Currencies } from '../types'

export class WalletEntity extends BaseEntity<WalletConstructorArgs> {
	ignoreInJSON = ['pin']

	constructor(data: WalletConstructorArgs) {
		super(data)
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
