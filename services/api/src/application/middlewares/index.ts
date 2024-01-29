import { AuthRole, makeMiddleware, NotAuthenticatedError, NotAuthorizedError, requireAuthUser, requireRefreshUser } from 'equipped'

export const isAuthenticatedButIgnoreVerified = makeMiddleware(async (request) => {
	await requireAuthUser(request)
})

export const isAuthenticated = makeMiddleware(async (request) => {
	await requireAuthUser(request)
	if (!request.authUser?.isVerified) throw new NotAuthenticatedError('verify your account to proceed')
	if (!request.authUser?.roles?.isActive) throw new NotAuthenticatedError('your account is not approved yet')
})

export const hasRefreshToken = makeMiddleware(async (request) => {
	await requireRefreshUser(request)
})

export const isAdmin = makeMiddleware(async (request) => {
	const isAdmin = request.authUser?.roles?.[AuthRole.isAdmin] || request.authUser?.roles?.[AuthRole.isSuperAdmin]
	if (!request.authUser) throw new NotAuthenticatedError()
	if (!isAdmin) throw new NotAuthorizedError()
})

export const isDriver = makeMiddleware(async (request) => {
	const isDriver = request.authUser?.roles?.[AuthRole.isDriver]
	if (!request.authUser) throw new NotAuthenticatedError()
	if (!isDriver) throw new NotAuthorizedError()
})

export const isCustomer = makeMiddleware(async (request) => {
	const isCustomer = request.authUser?.roles?.[AuthRole.isCustomer]
	if (!request.authUser) throw new NotAuthenticatedError()
	if (!isCustomer) throw new NotAuthorizedError()
})
