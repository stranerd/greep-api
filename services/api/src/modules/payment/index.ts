import { TransactionRepository } from './data/repositories/transactions'
import { WalletRepository } from './data/repositories/wallets'
import { WithdrawalRepository } from './data/repositories/withdrawals'
import { TransactionsUseCase } from './domain/useCases/transactions'
import { WalletsUseCase } from './domain/useCases/wallets'
import { WithdrawalsUseCase } from './domain/useCases/withdrawals'

const transactionRepository = TransactionRepository.getInstance()
const walletRepository = WalletRepository.getInstance()
const withdrawalRepository = WithdrawalRepository.getInstance()

export const TransactionsUseCases = new TransactionsUseCase(transactionRepository)
export const WalletsUseCases = new WalletsUseCase(walletRepository)
export const WithdrawalsUseCases = new WithdrawalsUseCase(withdrawalRepository)

export { Currencies, TransactionStatus, TransactionType } from './domain/types'
export { Rates } from './utils/exchange'
export { FlutterwavePayment } from './utils/flutterwave'
export { fulfillTransaction, processTransactions } from './utils/transactions'
export { processWithdrawals } from './utils/withdrawals'
