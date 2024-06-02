import { Router } from 'equipped'
import chatMetas from './chatMetas'
import chats from './chats'
import support from './support'

const router = new Router({ path: '/messaging', groups: ['Messaging'] })
router.nest(chatMetas, chats, support)

export default router
