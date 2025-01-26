import { BaseEntity } from 'equipped'
import { Currencies } from '../types'

export class WalletEntity extends BaseEntity<WalletConstructorArgs, 'pin'> {
	__ignoreInJSON = ['pin' as const]

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
