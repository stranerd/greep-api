import { TransactionEntity } from '../entities/transactions'
import { WalletEntity } from '../entities/wallets'
import { WithdrawalEntity } from '../entities/withdrawals'
import { Currencies, TransferData, WithdrawData } from '../types'

export interface IWalletRepository {
	get: (userId: string) => Promise<WalletEntity>
	updateAmount: (userId: string, amount: number, currency: Currencies) => Promise<boolean>
	transfer: (data: TransferData) => Promise<TransactionEntity>
	withdraw: (data: WithdrawData) => Promise<WithdrawalEntity>
	sendPinResetMail: (userId: string, email: string) => Promise<boolean>
	resetPin: (userId: string, token: string, pin: string) => Promise<boolean>
	updatePin: (userId: string, oldPin: string | null, pin: string) => Promise<boolean>
}
