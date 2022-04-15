import { makeMiddleware, NotAuthenticatedError, NotAuthorizedError } from '@stranerd/api-commons'
import { SupportedAuthRoles } from '@utils/types/auth'

export const isAdmin = makeMiddleware(
	async (request) => {
		const isAdmin = request.authUser?.roles?.[SupportedAuthRoles.isAdmin] || request.authUser?.roles?.['isSuperAdmin']
		if (!request.authUser) throw new NotAuthenticatedError()
		if (!isAdmin) throw new NotAuthorizedError()
	}
)
