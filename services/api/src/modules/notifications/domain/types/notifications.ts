export enum NotificationType {
	WalletFundSuccessful = 'WalletFundSuccessful',
}

export type NotificationData = {
	type: NotificationType.WalletFundSuccessful, amount: number, currency: string
}