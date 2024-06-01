import { Router } from 'equipped'
import { chatRoutes } from './chat'
import { chatMetaRoutes } from './chatMeta'
import { supportRoutes } from './support'

const router = new Router({ path: '/messaging', groups: ['Messaging'] })
router.add(...chatMetaRoutes, ...chatRoutes, ...supportRoutes)

export default router
