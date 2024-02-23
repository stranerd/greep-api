import { ViewsController } from '@application/controllers/interactions/views'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const viewsRoutes = groupRoutes('/views', [
	{
		path: '/',
		method: 'get',
		controllers: [makeController(async (req) => ViewsController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [makeController(async (req) => ViewsController.find(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => ViewsController.create(req))],
	},
])
