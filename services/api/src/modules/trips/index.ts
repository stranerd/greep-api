import { CustomerRepository } from './data/repositories/customers'
import { TransactionRepository } from './data/repositories/transactions'
import { TripRepository } from './data/repositories/trips'
import { CustomersUseCase } from './domain/useCases/customers'
import { TransactionsUseCase } from './domain/useCases/transactions'
import { TripsUseCase } from './domain/useCases/trips'

const customerRepository = CustomerRepository.getInstance()
const transactionRepository = TransactionRepository.getInstance()
const tripRepository = TripRepository.getInstance()

export const CustomersUseCases = new CustomersUseCase(customerRepository)
export const TransactionsUseCases = new TransactionsUseCase(transactionRepository)
export const TripsUseCases = new TripsUseCase(tripRepository)

export { PaymentType, TransactionType, TripStatus } from './domain/types'
