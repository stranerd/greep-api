import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'
import { MyController } from '../../controllers/users/my'

export const myRoutes = groupRoutes('/my', [
	{
		path: '/quickSend',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => MyController.quickSend(req))],
	},
	{
		path: '/drivers',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => MyController.drivers(req))],
	},
])
