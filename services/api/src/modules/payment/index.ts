import { TransactionRepository } from './data/repositories/transactions'
import { WalletRepository } from './data/repositories/wallets'
import { TransactionsUseCase } from './domain/useCases/transactions'
import { WalletsUseCase } from './domain/useCases/wallets'

const transactionRepository = TransactionRepository.getInstance()
const walletRepository = WalletRepository.getInstance()

export const TransactionsUseCases = new TransactionsUseCase(transactionRepository)
export const WalletsUseCases = new WalletsUseCase(walletRepository)

export { TransactionFromModel } from './data/models/transactions'
export { WalletFromModel } from './data/models/wallets'
export { TransactionEntity } from './domain/entities/transactions'
export { WalletEntity } from './domain/entities/wallets'
export {
	Currencies, TransactionStatus, TransactionType
} from './domain/types'
