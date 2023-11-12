import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController, StatusCodes } from 'equipped'
import { ChatMetaController } from '../../controllers/messaging/chatMeta'

export const chatMetaRoutes = groupRoutes('/chatMetas', [
	{
		path: '/',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await ChatMetaController.get(req)
				}
			})
		]
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await ChatMetaController.find(req)
				}
			})
		]
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await ChatMetaController.delete(req)
				}
			})
		]
	}
])