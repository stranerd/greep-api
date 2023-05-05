export enum Currencies {
	TRY = 'TRY'
}

export enum TransactionStatus {
	initialized = 'initialized',
	fulfilled = 'fulfilled',
	failed = 'failed',
	settled = 'settled'
}

export enum TransactionType {
	NewCard = 'NewCard',
	Transfer = 'Transfer',
}

type TransactionNewCard = {
	type: TransactionType.NewCard
}

export type TransactionData = TransactionNewCard

export enum MethodType {
	card = 'card'
}

export type MethodData = {
	type: MethodType.card
	last4Digits: string
	country: string
	cardType: string
	expiredAt: number
	expired: boolean
}