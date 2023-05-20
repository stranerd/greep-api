import { usersRoutes } from './users'
import { customersRoutes } from './customers'
import { transactionsRoutes } from './transactions'
import { tripsRoutes } from './trips'

export const userRoutes = [
	...usersRoutes,
	...customersRoutes,
	...transactionsRoutes,
	...tripsRoutes
]