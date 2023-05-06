export enum Currencies {
	TRY = 'TRY',
	NGN = 'NGN'
}

export enum TransactionStatus {
	initialized = 'initialized',
	fulfilled = 'fulfilled',
	failed = 'failed',
	settled = 'settled'
}

export enum TransactionType {
	FundWallet = 'FundWallet',
	Transfer = 'Transfer',
}

export type TransactionData = {
	type: TransactionType.FundWallet
} | {
	type: TransactionType.Transfer
}