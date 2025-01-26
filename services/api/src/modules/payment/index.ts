import { RequestRepository } from './data/repositories/requests'
import { TransactionRepository } from './data/repositories/transactions'
import { WalletRepository } from './data/repositories/wallets'
import { WithdrawalRepository } from './data/repositories/withdrawals'
import { RequestsUseCase } from './domain/useCases/requests'
import { TransactionsUseCase } from './domain/useCases/transactions'
import { WalletsUseCase } from './domain/useCases/wallets'
import { WithdrawalsUseCase } from './domain/useCases/withdrawals'

const transactionRepository = TransactionRepository.getInstance()
const requestRepository = RequestRepository.getInstance()
const walletRepository = WalletRepository.getInstance()
const withdrawalRepository = WithdrawalRepository.getInstance()

export const TransactionsUseCases = new TransactionsUseCase(transactionRepository)
export const RequestsUseCases = new RequestsUseCase(requestRepository)
export const WalletsUseCases = new WalletsUseCase(walletRepository)
export const WithdrawalsUseCases = new WithdrawalsUseCase(withdrawalRepository)

export { Currencies, RequestStatus, TransactionStatus, TransactionType, WithdrawalStatus } from './domain/types'
export { Rates } from './utils/exchange'
export { FlutterwavePayment } from './utils/flutterwave'
export { fulfillTransaction, processTransactions } from './utils/transactions'
export { processWithdrawals } from './utils/withdrawals'

export { RequestEntity } from './domain/entities/requests'
export { TransactionEntity } from './domain/entities/transactions'
export { WalletEntity } from './domain/entities/wallets'
export { WithdrawalEntity } from './domain/entities/withdrawals'
