import { groupRoutes } from 'equipped'
import { activitiesRoutes } from './activities'
import { myRoutes } from './my'
import { referralsRoutes } from './referrals'
import { usersRoutes } from './users'

export const userRoutes = groupRoutes('/users', [
	...activitiesRoutes,
	...myRoutes,
	...referralsRoutes,
	...usersRoutes,
])