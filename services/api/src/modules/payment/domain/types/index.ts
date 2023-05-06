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
	Sent = 'Sent',
	Received = 'Received',
}

export type TransactionData = {
	type: TransactionType.FundWallet,
	exchangeRate: number
} | {
	type: TransactionType.Sent,
	note: string
	to: string
} | {
	type: TransactionType.Received,
	note: string
	from: string
}

export type TransferData = {
	from: string,
	to: string,
	fromEmail: string,
	toEmail: string,
	amount: number,
	note: string
}