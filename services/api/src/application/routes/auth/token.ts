import { makeController, Route } from 'equipped'
import { TokenController } from '../../controllers/auth/token'

const getNewTokens: Route = {
	path: '/auth/token',
	method: 'post',
	controllers: [makeController(async (req) => TokenController.getNewTokens(req))],
}

const routes: Route[] = [getNewTokens]
export default routes
