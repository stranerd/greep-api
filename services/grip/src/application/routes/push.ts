import { makeController, requireAuthUser, Route, StatusCodes, validate, Validation } from '@stranerd/api-commons'
import { UpdateUserTokens } from '@modules/push'

const subscribeDevice: Route = {
	path: '/push/devices/subscribe',
	method: 'post',
	controllers: [
		requireAuthUser,
		makeController(async (req) => {
			const { token } = validate({
				token: req.body.token
			}, {
				token: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] }
			})
			const res = await UpdateUserTokens.execute({ userId: req.authUser!.id, tokens: [token], add: true })
			return {
				status: StatusCodes.Ok,
				result: !!res
			}
		})
	]
}

const unsubscribeDevice: Route = {
	path: '/push/devices/unsubscribe',
	method: 'post',
	controllers: [
		requireAuthUser,
		makeController(async (req) => {
			const { token } = validate({
				token: req.body.token
			}, {
				token: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] }
			})
			const res = await UpdateUserTokens.execute({ userId: req.authUser!.id, tokens: [token], add: false })
			return {
				status: StatusCodes.Ok,
				result: !!res
			}
		})
	]
}

const routes: Route[] = [subscribeDevice, unsubscribeDevice]
export default routes