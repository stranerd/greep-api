import { makeMiddleware, NotAuthenticatedError, NotAuthorizedError } from '@stranerd/api-commons'

export const isAdminInSpecifiedApp = makeMiddleware(
	async (request) => {
		const appType = request.body.app
		if (!request.authUser) throw new NotAuthenticatedError()
		if (!request.authUser.roles[appType]?.['isAdmin']) throw new NotAuthorizedError()
	}
)
