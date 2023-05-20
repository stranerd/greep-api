import { activitiesRoutes } from './activities'
import { referralsRoutes } from './referrals'
import { usersRoutes } from './users'

export const userRoutes = [
	...activitiesRoutes,
	...referralsRoutes,
	...usersRoutes,
]