import { groupRoutes } from 'equipped'
import { activitiesRoutes } from './activities'
import { myRoutes } from './my'
import { referralsRoutes } from './referrals'
import { usersRoutes } from './users'

export const userRoutes = groupRoutes({ path: '/users', tags: ['Users'] }, [
	...activitiesRoutes,
	...myRoutes,
	...referralsRoutes,
	...usersRoutes,
])
