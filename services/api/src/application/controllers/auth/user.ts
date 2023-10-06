import { AuthUsersUseCases, signOutUser } from '@modules/auth'
import { StorageUseCases } from '@modules/storage'
import { superAdminEmail } from '@utils/environment'
import { AuthRole, BadRequestError, NotFoundError, Request, Schema, Validation, validate, verifyAccessToken } from 'equipped'

export class UserController {
	static async findUser (req: Request) {
		const userId = req.authUser!.id
		return await AuthUsersUseCases.findUser(userId)
	}

	static async updateUser (req: Request) {
		const userId = req.authUser!.id
		const uploadedPhoto = req.files.photo?.[0] ?? null
		const changedPhoto = !!uploadedPhoto || req.body.photo === null

		req.body.username = req.body.username?.toLowerCase() ?? ''
		const users = await AuthUsersUseCases.findUsersByEmailorUsername(req.body.username)
		const usernameUser = users.find((u) => u.username === req.body.username)

		const data = validate({
			firstName: Schema.string().min(1),
			lastName: Schema.string().min(1),
			username: Schema.string().min(4).addRule((value) => {
				const username = value as string
				if (!usernameUser || usernameUser.id === userId) return Validation.isValid(username)
				return Validation.isInvalid(['username already in use'], username)
			}),
			photo: Schema.file().image().nullable(),
			phone: Schema.any().addRule(Validation.isValidPhone()).nullable()
		}, { ...req.body, photo: uploadedPhoto })
		const { firstName, lastName, username, phone } = data
		const photo = uploadedPhoto ? await StorageUseCases.upload('profiles', uploadedPhoto) : undefined

		return await AuthUsersUseCases.updateProfile({
			userId,
			data: {
				name: { first: firstName, last: lastName },
				username, phone,
				...(changedPhoto ? { photo } : {}) as any
			}
		})
	}

	static async updateUserRole (req: Request) {
		const { role, userId, value } = validate({
			role: Schema.in(Object.values(AuthRole)
				.filter((key) => key !== AuthRole.isSuperAdmin)),
			userId: Schema.string().min(1),
			value: Schema.boolean()
		}, req.body)

		if (req.authUser!.id === userId) throw new BadRequestError('You cannot modify your own roles')

		return await AuthUsersUseCases.updateRole({
			userId, roles: { [role]: value }
		})
	}

	static async signout (req: Request) {
		const user = await verifyAccessToken(req.headers.AccessToken ?? '').catch(() => null)
		return await signOutUser(user?.id ?? '')
	}

	static async superAdmin (_: Request) {
		const user = await AuthUsersUseCases.findUserByEmail(superAdminEmail)
		if (!user) throw new NotFoundError()
		return await AuthUsersUseCases.updateRole({
			userId: user.id,
			roles: {
				[AuthRole.isActive]: true,
				[AuthRole.isAdmin]: true,
				[AuthRole.isSuperAdmin]: true
			}
		})
	}

	static async delete (req: Request) {
		const authUserId = req.authUser!.id
		const deleted = await AuthUsersUseCases.deleteUsers([authUserId])
		await signOutUser(authUserId)
		return deleted
	}
}