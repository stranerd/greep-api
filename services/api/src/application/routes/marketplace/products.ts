import { ProductsController } from '@application/controllers/marketplace/products'
import { isAdmin, isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const productsRoutes = groupRoutes('/products', [
	{
		path: '/',
		method: 'get',
		controllers: [makeController(async (req) => ProductsController.get(req))],
	},
	{
		path: '/recommendation/products',
		method: 'get',
		controllers: [makeController(async (req) => ProductsController.recommendProducts(req))],
	},
	{
		path: '/recommendation/tags',
		method: 'get',
		controllers: [makeController(async (req) => ProductsController.recommendTags(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, isAdmin, makeController(async (req) => ProductsController.create(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [makeController(async (req) => ProductsController.find(req))],
	},
	{
		path: '/:id',
		method: 'put',
		controllers: [isAuthenticated, makeController(async (req) => ProductsController.update(req))],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [isAuthenticated, makeController(async (req) => ProductsController.delete(req))],
	},
])
