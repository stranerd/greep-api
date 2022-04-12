import { BadRequestError, makeMiddleware, NotAuthenticatedError } from '@stranerd/api-commons'

export const cannotModifyMyRole = makeMiddleware(
	async (request) => {
		const userIdToEdit = request.body.userId
		if (!request.authUser) throw new NotAuthenticatedError()
		if (request.authUser.id === userIdToEdit) throw new BadRequestError('You cannot modify your own roles')
	}
)
