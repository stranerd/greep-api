import { Router } from 'equipped'
import { activitiesRoutes } from './activities'
import { myRoutes } from './my'
import { referralsRoutes } from './referrals'
import { usersRoutes } from './users'

const router = new Router({ path: '/users', groups: ['Users'] })
router.add(...activitiesRoutes, ...myRoutes, ...referralsRoutes, ...usersRoutes)

export default router
