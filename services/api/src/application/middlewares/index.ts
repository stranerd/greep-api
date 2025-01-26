import { AuthRole, makeMiddleware, NotAuthenticatedError, NotAuthorizedError, requireAuthUser } from 'equipped'

export const isAuthenticatedButIgnoreVerified = requireAuthUser

export const isAuthenticated = makeMiddleware(
	async (request) => {
		await requireAuthUser.cb(request)
		if (!request.authUser?.isVerified) throw new NotAuthenticatedError('verify your account to proceed')
	},
	(route) => {
		requireAuthUser.onSetup?.(route)
		route.descriptions ??= []
		route.descriptions.push('Requires auth user to be verified')
	},
)

export const isAdmin = makeMiddleware(
	async (request) => {
		const isAdmin = request.authUser?.roles?.[AuthRole.isAdmin]
		if (!request.authUser) throw new NotAuthenticatedError()
		if (!isAdmin) throw new NotAuthorizedError()
	},
	(route) => {
		route.descriptions ??= []
		route.descriptions.push('Requires auth user to be an admin')
	},
)

export const isDriver = makeMiddleware(
	async (request) => {
		const isDriver = request.authUser?.roles?.[AuthRole.isDriver]
		if (!request.authUser) throw new NotAuthenticatedError()
		if (!isDriver) throw new NotAuthorizedError('not a driver')
	},
	(route) => {
		route.descriptions ??= []
		route.descriptions.push('Requires auth user to be a driver with an active account')
	},
)

export const isVendor = makeMiddleware(
	async (request) => {
		const isVendor = request.authUser?.roles?.[AuthRole.isVendor]
		if (!request.authUser) throw new NotAuthenticatedError()
		if (!isVendor) throw new NotAuthorizedError('not a vendor')
	},
	(route) => {
		route.descriptions ??= []
		route.descriptions.push('Requires auth user to be a vendor')
	},
)
