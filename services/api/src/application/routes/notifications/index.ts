import { Router } from 'equipped'
import contact from './contact'
import notifications from './notifications'
import tokens from './tokens'

const router = new Router({ path: '/notifications', groups: ['Notifications'] })
router.nest(contact, notifications, tokens)

export default router
