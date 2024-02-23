import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'
import { ChatController } from '../../controllers/messaging/chat'

export const chatRoutes = groupRoutes('/chats', [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => ChatController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => ChatController.find(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => ChatController.add(req))],
	},
	{
		path: '/read',
		method: 'put',
		controllers: [isAuthenticated, makeController(async (req) => ChatController.markRead(req))],
	},
])
