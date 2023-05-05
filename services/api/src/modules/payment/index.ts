import { MethodRepository } from './data/repositories/methods'
import { TransactionRepository } from './data/repositories/transactions'
import { WalletRepository } from './data/repositories/wallets'
import { MethodsUseCase } from './domain/useCases/methods'
import { TransactionsUseCase } from './domain/useCases/transactions'
import { WalletsUseCase } from './domain/useCases/wallets'

const transactionRepository = TransactionRepository.getInstance()
const methodRepository = MethodRepository.getInstance()
const walletRepository = WalletRepository.getInstance()

export const TransactionsUseCases = new TransactionsUseCase(transactionRepository)
export const MethodsUseCases = new MethodsUseCase(methodRepository)
export const WalletsUseCases = new WalletsUseCase(walletRepository)

export { MethodFromModel, MethodToModel } from './data/models/methods'
export { TransactionFromModel } from './data/models/transactions'
export { WalletFromModel } from './data/models/wallets'
export { MethodEntity } from './domain/entities/methods'
export { TransactionEntity } from './domain/entities/transactions'
export { WalletEntity } from './domain/entities/wallets'
export {
	Currencies, MethodType, TransactionStatus, TransactionType
} from './domain/types'
