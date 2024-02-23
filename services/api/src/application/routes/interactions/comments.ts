import { CommentsController } from '@application/controllers/interactions/comments'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const commentsRoutes = groupRoutes('/comments', [
	{
		path: '/',
		method: 'get',
		controllers: [makeController(async (req) => CommentsController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [makeController(async (req) => CommentsController.find(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => CommentsController.create(req))],
	},
	{
		path: '/:id',
		method: 'put',
		controllers: [isAuthenticated, makeController(async (req) => CommentsController.update(req))],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [isAuthenticated, makeController(async (req) => CommentsController.delete(req))],
	},
])
