import { Router } from 'equipped'
import activities from './activities'
import my from './my'
import referrals from './referrals'
import users from './users'

const router = new Router({ path: '/users', groups: ['Users'] })
router.nest(activities, my, referrals, users)

export default router
