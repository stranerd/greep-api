import { CommentsController } from '@application/controllers/interactions/comments'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const commentsRoutes = groupRoutes({ path: '/comments', groups: ['Comments'] }, [
	{
		path: '/',
		method: 'get',
		handler: CommentsController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: CommentsController.find,
	},
	{
		path: '/',
		method: 'post',
		handler: CommentsController.create,
		middlewares: [isAuthenticated],
	},
	{
		path: '/:id',
		method: 'put',
		handler: CommentsController.update,
		middlewares: [isAuthenticated],
	},
	{
		path: '/:id',
		method: 'delete',
		handler: CommentsController.delete,
		middlewares: [isAuthenticated],
	},
])
