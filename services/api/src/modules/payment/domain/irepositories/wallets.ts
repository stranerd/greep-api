import { WalletEntity } from '../entities/wallets'

export interface IWalletRepository {
	get: (userId: string) => Promise<WalletEntity>
	updateAmount: (userId: string, amount: number) => Promise<boolean>
}
