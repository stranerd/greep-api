import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'
import { ChatController } from '../../controllers/messaging/chat'

export const chatRoutes = groupRoutes({ path: '/chats', tags: ['Chats'], middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: ChatController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: ChatController.find,
	},
	{
		path: '/',
		method: 'post',
		handler: ChatController.add,
	},
	{
		path: '/read',
		method: 'put',
		handler: ChatController.markRead,
	},
])
