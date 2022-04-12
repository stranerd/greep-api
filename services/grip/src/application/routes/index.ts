import { makeController, Route, StatusCodes } from '@stranerd/api-commons'
import { appId } from '@utils/environment'
import storageRoutes from './storage'
import pushRoutes from './push'
import authRoutes from './auth'

export const routes: Route[] = [
	...storageRoutes,
	...pushRoutes,
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