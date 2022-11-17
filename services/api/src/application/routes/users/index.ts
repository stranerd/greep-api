import { usersRoutes } from './users'
import { customersRoutes } from './customers'
import { transactionsRoutes } from './transactions'
import { tripsRoutes } from './trips'

export default [
	...usersRoutes,
	...customersRoutes,
	...transactionsRoutes,
	...tripsRoutes
]