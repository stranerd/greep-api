import { groupRoutes } from 'equipped'
import { chatRoutes } from './chat'
import { chatMetaRoutes } from './chatMeta'

export const messagingRoutes = groupRoutes('/messaging', [
	...chatMetaRoutes,
	...chatRoutes
])