import { groupRoutes } from 'equipped'
import { chatRoutes } from './chat'
import { chatMetaRoutes } from './chatMeta'
import { supportRoutes } from './support'

export const messagingRoutes = groupRoutes('/messaging', [...chatMetaRoutes, ...chatRoutes, ...supportRoutes])
