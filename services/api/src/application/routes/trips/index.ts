import { customersRoutes } from './customers'
import { transactionsRoutes } from './transactions'
import { tripsRoutes } from './trips'

export const tripRoutes = [
	...customersRoutes,
	...transactionsRoutes,
	...tripsRoutes
]