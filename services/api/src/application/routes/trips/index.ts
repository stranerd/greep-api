import { transactionsRoutes } from './transactions'
import { tripsRoutes } from './trips'

export const tripRoutes = [
	...transactionsRoutes,
	...tripsRoutes
]