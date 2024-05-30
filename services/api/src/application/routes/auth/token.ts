import { groupRoutes, requireRefreshUser } from 'equipped'
import { TokenController } from '../../controllers/auth/token'

export default groupRoutes({ path: '/token', tags: ['Token'] }, [
	{
		path: '/auth/token',
		method: 'post',
		handler: TokenController.getNewTokens,
		middlewares: [requireRefreshUser],
	},
])
