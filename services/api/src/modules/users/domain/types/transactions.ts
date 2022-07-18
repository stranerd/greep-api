export enum TransactionType {
	expense = 'expense',
	trip = 'trip',
	balance = 'balance'
}

type ExpenseType = {
	type: TransactionType.expense
	name: string
}

export enum PaymentType {
	card = 'card',
	cash = 'cash'
}

type TripType = {
	type: TransactionType.trip
	customerName: string
	paymentType: PaymentType
	paidAmount: number
	debt: number
}

type BalanceType = {
	type: TransactionType.balance
	parentId: string
}

export type TransactionData = ExpenseType | TripType | BalanceType