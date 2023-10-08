import { groupRoutes } from 'equipped'
import { activitiesRoutes } from './activities'
import { referralsRoutes } from './referrals'
import { usersRoutes } from './users'

export const userRoutes = groupRoutes('/users', [
	...activitiesRoutes,
	...referralsRoutes,
	...usersRoutes,
])