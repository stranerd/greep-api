import { referralsRoutes } from './referrals'
import { usersRoutes } from './users'
import { customersRoutes } from './customers'

export default [
	...referralsRoutes,
	...usersRoutes,
	...customersRoutes
]