import { makeMiddleware, NotAuthenticatedError, NotAuthorizedError } from '@stranerd/api-commons'

export const isAdmin = makeMiddleware(
	async (request) => {
		if (!request.authUser) throw new NotAuthenticatedError()
		if (!request.authUser.roles['isAdmin']) throw new NotAuthorizedError()
	}
)
