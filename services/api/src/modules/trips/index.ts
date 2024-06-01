import { TransactionRepository } from './data/repositories/transactions'
import { TripRepository } from './data/repositories/trips'
import { TransactionsUseCase } from './domain/useCases/transactions'
import { TripsUseCase } from './domain/useCases/trips'

const transactionRepository = TransactionRepository.getInstance()
const tripRepository = TripRepository.getInstance()

export const TransactionsUseCases = new TransactionsUseCase(transactionRepository)
export const TripsUseCases = new TripsUseCase(tripRepository)

export { TransactionEntity } from './domain/entities/transactions'
export { TripEntity } from './domain/entities/trips'

export { TransactionToModel } from './data/models/transactions'
export { TripToModel } from './data/models/trips'

export { PaymentType, TransactionType, TripStatus } from './domain/types'
