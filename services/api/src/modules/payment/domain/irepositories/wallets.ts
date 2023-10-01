import { WalletEntity } from '../entities/wallets'
import { TransferData, WithdrawData } from '../types'

export interface IWalletRepository {
	get: (userId: string) => Promise<WalletEntity>
	updateAmount: (userId: string, amount: number) => Promise<boolean>
	transfer: (data: TransferData) => Promise<boolean>
	withdraw: (data: WithdrawData) => Promise<boolean>
	updatePin: (userId: string, oldPin: string | null, pin: string) => Promise<boolean>
}
