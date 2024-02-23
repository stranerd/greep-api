import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'
import { ChatMetaController } from '../../controllers/messaging/chatMeta'

export const chatMetaRoutes = groupRoutes('/chatMetas', [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => ChatMetaController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => ChatMetaController.find(req))],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [isAuthenticated, makeController(async (req) => ChatMetaController.delete(req))],
	},
])
