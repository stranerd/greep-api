export enum NotificationType {
	WalletFundSuccessful = 'WalletFundSuccessful',
	WithdrawalSuccessful = 'WithdrawalSuccessful',
	WithdrawalFailed = 'WithdrawalFailed',
}

export type NotificationData = {
	type: NotificationType.WalletFundSuccessful, amount: number, currency: string
} | {
	type: NotificationType.WithdrawalSuccessful, withdrawalId: string, amount: number, currency: string
} | {
	type: NotificationType.WithdrawalFailed, withdrawalId: string, amount: number, currency: string
}