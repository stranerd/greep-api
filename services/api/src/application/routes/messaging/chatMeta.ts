import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'
import { ChatMetaController } from '../../controllers/messaging/chatMeta'

export const chatMetaRoutes = groupRoutes({ path: '/chatMetas', groups: ['Chat metas'], middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: ChatMetaController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: ChatMetaController.find,
	},
	{
		path: '/:id',
		method: 'delete',
		handler: ChatMetaController.delete,
	},
])
