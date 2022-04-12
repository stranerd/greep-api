import { makeController, Route, StatusCodes } from '@stranerd/api-commons'
import { appId } from '@utils/environment'
import storageRoutes from './storage'
import authRoutes from './auth'

export const routes: Route[] = [
	...storageRoutes,
	...authRoutes,
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