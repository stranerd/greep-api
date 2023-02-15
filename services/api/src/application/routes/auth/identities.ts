import { makeController, Route, StatusCodes } from 'equipped'
import { IdentitiesController } from '../../controllers/auth/identities'

const googleSignIn: Route = {
	path: '/auth/identities/google',
	method: 'post',
	controllers: [
		makeController(async (req) => {
			return {
				status: StatusCodes.Ok,
				result: await IdentitiesController.googleSignIn(req)
			}
		})
	]
}

const appleSignIn: Route = {
	path: '/auth/identities/apple',
	method: 'post',
	controllers: [
		makeController(async (req) => {
			return {
				status: StatusCodes.Ok,
				result: await IdentitiesController.appleSignIn(req)
			}
		})
	]
}

const routes: Route[] = [googleSignIn, appleSignIn]
export default routes