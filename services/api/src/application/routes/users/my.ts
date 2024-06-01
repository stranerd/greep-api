import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'
import { MyController } from '../../controllers/users/my'

export const myRoutes = groupRoutes({ path: '/my', groups: ['My'], middlewares: [isAuthenticated] }, [
	{
		path: '/quickSend',
		method: 'get',
		handler: MyController.quickSend,
	},
	{
		path: '/drivers',
		method: 'get',
		handler: MyController.drivers,
	},
])
