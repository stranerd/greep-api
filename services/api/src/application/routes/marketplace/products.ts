import { ProductsController } from '@application/controllers/marketplace/products'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const productsRoutes = groupRoutes({ path: '/products', groups: ['Products'] }, [
	{
		path: '/',
		method: 'get',
		handler: ProductsController.get,
	},
	{
		path: '/recommendation/products',
		method: 'get',
		handler: ProductsController.recommendProducts,
	},
	{
		path: '/recommendation/tags',
		method: 'get',
		handler: ProductsController.recommendTags,
	},
	{
		path: '/',
		method: 'post',
		handler: ProductsController.create,
		middlewares: [isAuthenticated],
	},
	{
		path: '/:id',
		method: 'get',
		handler: ProductsController.find,
	},
	{
		path: '/:id',
		method: 'put',
		handler: ProductsController.update,
		middlewares: [isAuthenticated],
	},
	{
		path: '/:id',
		method: 'delete',
		handler: ProductsController.delete,
		middlewares: [isAuthenticated],
	},
])
