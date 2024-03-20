import { Location } from '@utils/types'

export enum Currencies {
	TRY = 'TRY',
	NGN = 'NGN',
}

export enum TransactionStatus {
	initialized = 'initialized',
	fulfilled = 'fulfilled',
	failed = 'failed',
	settled = 'settled',
}

export enum TransactionType {
	FundWallet = 'FundWallet',
	Sent = 'Sent',
	Received = 'Received',
	Withdrawal = 'Withdrawal',
	WithdrawalRefund = 'WithdrawalRefund',
	OrderPayment = 'OrderPayment',
	OrderPaymentRefund = 'OrderPaymentRefund',
}

export type TransactionData =
	| {
			type: TransactionType.FundWallet
			exchangeRate: number
	  }
	| {
			type: TransactionType.Sent
			note: string
			to: string
			toName: string
	  }
	| {
			type: TransactionType.Received
			note: string
			from: string
			fromName: string
	  }
	| {
			type: TransactionType.Withdrawal
			withdrawalId: string
	  }
	| {
			type: TransactionType.WithdrawalRefund
			withdrawalId: string
	  }
	| {
			type: TransactionType.OrderPayment
			orderId: string
	  }
	| {
			type: TransactionType.OrderPaymentRefund
			orderId: string
	  }

export type TransferData = {
	from: string
	to: string
	fromName: string
	fromEmail: string
	toName: string
	toEmail: string
	amount: number
	currency: Currencies
	note: string
}

export enum WithdrawalStatus {
	created = 'created',
	inProgress = 'inProgress',
	failed = 'failed',
	completed = 'completed',
	refunded = 'refunded',
}

export type WithdrawData = {
	userId: string
	email: string
	amount: number
	location: Location
}

export enum RequestStatus {
	created = 'created',
	paid = 'paid',
	rejected = 'rejected',
	acknowledged = 'acknowledged',
}
