import { TransactionRepository } from './data/repositories/transactions'
import { TripRepository } from './data/repositories/trips'
import { TransactionsUseCase } from './domain/useCases/transactions'
import { TripsUseCase } from './domain/useCases/trips'

const transactionRepository = TransactionRepository.getInstance()
const tripRepository = TripRepository.getInstance()

export const TransactionsUseCases = new TransactionsUseCase(transactionRepository)
export const TripsUseCases = new TripsUseCase(tripRepository)

export { PaymentType, TransactionType, TripStatus } from './domain/types'
