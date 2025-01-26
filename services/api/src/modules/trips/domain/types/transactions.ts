export enum TransactionType {
	expense = 'expense',
	trip = 'trip',
	balance = 'balance',
	withdrawal = 'withdrawal',
}

type ExpenseType = {
	type: TransactionType.expense
	name: string
}

export enum PaymentType {
	card = 'card',
	cash = 'cash',
}

type TripType = {
	type: TransactionType.trip
	tripId: string | null
	customerId: string | null
	customerName: string
	paymentType: PaymentType
	paidAmount: number
	debt: number
}

type BalanceType = {
	type: TransactionType.balance
	parentId: string
}

type WithdrawalType = {
	type: TransactionType.withdrawal
	withdrawalId: string
}

export type TransactionData = ExpenseType | TripType | BalanceType | WithdrawalType
