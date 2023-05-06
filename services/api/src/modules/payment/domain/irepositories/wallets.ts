import { WalletEntity } from '../entities/wallets'
import { TransferData } from '../types'

export interface IWalletRepository {
	get: (userId: string) => Promise<WalletEntity>
	updateAmount: (userId: string, amount: number) => Promise<boolean>
	transfer: (data: TransferData) => Promise<boolean>
}
