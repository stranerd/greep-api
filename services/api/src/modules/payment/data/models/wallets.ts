import { Currencies } from '../../domain/types'

export interface WalletFromModel extends WalletToModel {
	_id: string
	balance: { amount: number, currency: Currencies }
	createdAt: number
	updatedAt: number
}

export interface WalletToModel {
	userId: string
}