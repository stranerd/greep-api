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
	FundWallet = 'FundWallet',
	Sent = 'Sent',
	Received = 'Received',
}

export type TransactionData = {
	type: TransactionType.FundWallet,
} | {
	type: TransactionType.Sent,
	note: string
	to: string
	toName: string
} | {
	type: TransactionType.Received,
	note: string
	from: string
	fromName: string
}

export type TransferData = {
	from: string,
	to: string,
	fromName: string,
	fromEmail: string,
	toName: string,
	toEmail: string,
	amount: number,
	note: string
}