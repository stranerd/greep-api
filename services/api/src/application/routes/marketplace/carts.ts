import { CartsController } from '@application/controllers/marketplace/carts'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const cartsRoutes = groupRoutes({ path: '/carts', groups: ['Carts'] }, [
	{
		path: '/',
		method: 'get',
		handler: CartsController.get,
		middlewares: [isAuthenticated],
	},
	{
		path: '/:id',
		method: 'get',
		handler: CartsController.find,
		middlewares: [isAuthenticated],
	},
	{
		path: '/',
		method: 'post',
		handler: CartsController.add,
		middlewares: [isAuthenticated],
	},
	{
		path: '/:id/clear',
		method: 'post',
		handler: CartsController.clear,
		middlewares: [isAuthenticated],
	},
])
