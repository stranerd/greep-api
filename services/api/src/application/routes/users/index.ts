import { usersRoutes } from './users'
import { customersRoutes } from './customers'
import { transactionsRoutes } from './transactions'

export default [
	...usersRoutes,
	...customersRoutes,
	...transactionsRoutes
]