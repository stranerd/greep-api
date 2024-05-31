import { AuthResponse, getNewTokens } from '@modules/auth'
import { ApiDef, Router, requireRefreshUser } from 'equipped'

const router = new Router({ path: '/token', tags: ['Token'] })

router.post<ExchangeTokenRouteDef>({
	path: '/',
	key: 'token-exchange',
	middlewares: [requireRefreshUser],
	descriptions: ['Requires the Access-Token header even if expired'],
	security: [{ AccessToken: [] }],
})(async (req) => {
	const accessToken = req.headers.AccessToken ?? ''
	const refreshToken = req.headers.RefreshToken ?? ''
	return await getNewTokens({ accessToken, refreshToken })
})

export default router

type ExchangeTokenRouteDef = ApiDef<{
	key: 'token-exchange'
	method: 'post'
	response: AuthResponse
}>
