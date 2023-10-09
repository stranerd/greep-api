export enum NotificationType {
	AccountApplication = 'AccountApplication',
	WalletFundSuccessful = 'WalletFundSuccessful',
	WithdrawalSuccessful = 'WithdrawalSuccessful',
	WithdrawalFailed = 'WithdrawalFailed',
	RequestPaid = 'RequestPaid',
	RequestRejected = 'RequestRejected',
	RequestAcknowledged = 'RequestAcknowledged',
}

export type NotificationData = {
	type: NotificationType.AccountApplication, accepted: boolean, message: string
} | {
	type: NotificationType.WalletFundSuccessful, amount: number, currency: string
} | {
	type: NotificationType.WithdrawalSuccessful, withdrawalId: string, amount: number, currency: string
} | {
	type: NotificationType.WithdrawalFailed, withdrawalId: string, amount: number, currency: string
} | {
	type: NotificationType.RequestPaid, requestId: string, amount: number, currency: string
} | {
	type: NotificationType.RequestRejected, requestId: string, amount: number, currency: string
} | {
	type: NotificationType.RequestAcknowledged, requestId: string, amount: number, currency: string
}