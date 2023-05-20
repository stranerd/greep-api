import { referralsRoutes } from './referrals'
import { usersRoutes } from './users'

export const userRoutes = [
	...referralsRoutes,
	...usersRoutes,
]