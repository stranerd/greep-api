import { groupRoutes } from 'equipped'
import { UserController } from '../../controllers/auth/user'
import { isAdmin, isAuthenticated, isAuthenticatedButIgnoreVerified } from '../../middlewares'

export default groupRoutes({ path: '/user', tags: ['User'] }, [
	{
		path: '/',
		method: 'get',
		handler: UserController.findUser,
		middlewares: [isAuthenticatedButIgnoreVerified],
	},
	{
		path: '/roles',
		method: 'post',
		handler: UserController.updateUserRole,
		middlewares: [isAuthenticated, isAdmin],
	},
	{
		path: '/auth/user',
		method: 'put',
		handler: UserController.updateUser,
		middlewares: [isAuthenticated],
	},
	{
		path: '/signout',
		method: 'post',
		handler: UserController.signout,
	},
	{
		path: '/superAdmin',
		method: 'get',
		handler: UserController.superAdmin,
	},
	{
		path: '/',
		method: 'delete',
		handler: UserController.delete,
		middlewares: [isAuthenticated],
	},
])
