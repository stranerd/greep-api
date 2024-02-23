import { ReviewsController } from '@application/controllers/interactions/reviews'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const reviewsRoutes = groupRoutes('/reviews', [
	{
		path: '/',
		method: 'get',
		controllers: [makeController(async (req) => ReviewsController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [makeController(async (req) => ReviewsController.find(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => ReviewsController.add(req))],
	},
])
