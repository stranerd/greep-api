import { ReviewsController } from '@application/controllers/interactions/reviews'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const reviewsRoutes = groupRoutes({ path: '/reviews', groups: ['Reviews'] }, [
	{
		path: '/',
		method: 'get',
		handler: ReviewsController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: ReviewsController.find,
	},
	{
		path: '/',
		method: 'post',
		handler: ReviewsController.add,
		middlewares: [isAuthenticated],
	},
])
