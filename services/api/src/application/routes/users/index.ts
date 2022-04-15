import { referralsRoutes } from './referrals'
import { usersRoutes } from './users'
import { customersRoutes } from './customers'
import { transactionsRoutes } from './transactions'

export default [
	...referralsRoutes,
	...usersRoutes,
	...customersRoutes,
	...transactionsRoutes
]