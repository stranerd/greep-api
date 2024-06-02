import { Router } from 'equipped'
import notifications from './notifications'
import tokens from './tokens'

const router = new Router({ path: '/notifications', groups: ['Notifications'] })
router.nest(notifications, tokens)

export default router
