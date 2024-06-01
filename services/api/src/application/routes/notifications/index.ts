import { Router } from 'equipped'
import { notificationsRoutes } from './notifications'
import { tokenRoutes } from './tokens'

const router = new Router({ path: '/notifications', groups: ['Notifications'] })
router.add(...notificationsRoutes, ...tokenRoutes)

export default router
