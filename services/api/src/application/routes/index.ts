import { makeController, Route, StatusCodes } from '@stranerd/api-commons'
import { appId } from '@utils/environment'
import authRoutes from './auth'
import usersRoutes from './users'

export const routes: Route[] = [
	...authRoutes,
	...usersRoutes,
	{
		path: '/',
		method: 'get',
		controllers: [
			makeController(async () => {
				return {
					status: StatusCodes.Ok,
					result: `${appId} service running`
				}
			})
		]
	}
]