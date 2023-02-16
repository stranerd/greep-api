import { AuthUsersUseCases } from '@modules/auth'
import { StorageUseCases } from '@modules/storage'
import { superAdminEmail } from '@utils/environment'
import { signOutUser } from '@utils/modules/auth'
import { AuthRole, BadRequestError, Enum, NotFoundError, Request, Schema, validateReq, verifyAccessToken } from 'equipped'

export class UserController {
	static async findUser(req: Request) {
		const userId = req.authUser!.id
		return await AuthUsersUseCases.findUser(userId)
	}

	static async updateUser(req: Request) {
		const userId = req.authUser!.id
		const uploadedPhoto = req.files.photo?.[0] ?? null
		const changedPhoto = !!uploadedPhoto || req.body.photo === null
		const data = validateReq({
			firstName: Schema.string().min(1),
			lastName: Schema.string().min(1),
			photo: Schema.file().image().nullable()
		}, { ...req.body, photo: uploadedPhoto })
		const { firstName, lastName } = data
		const photo = uploadedPhoto ? await StorageUseCases.upload('profiles', uploadedPhoto) : undefined

		return await AuthUsersUseCases.updateProfile({
			userId,
			data: {
				name: { first: firstName, last: lastName },
				...(changedPhoto ? { photo } : {}) as any
			}
		})
	}

	static async updateUserRole(req: Request) {
		const { role, userId, value } = validateReq({
			role: Schema.any<Enum<typeof AuthRole>>().in(Object.values(AuthRole)
				.filter((key) => key !== AuthRole.isSuperAdmin)),
			userId: Schema.string().min(1),
			value: Schema.boolean()
		}, req.body)

		if (req.authUser!.id === userId) throw new BadRequestError('You cannot modify your own roles')

		return await AuthUsersUseCases.updateRole({
			userId, roles: { [role]: value }
		})
	}

	static async signout(req: Request) {
		const user = await verifyAccessToken(req.headers.AccessToken ?? '').catch(() => null)
		return await signOutUser(user?.id ?? '')
	}

	static async superAdmin(_: Request) {
		const user = await AuthUsersUseCases.findUserByEmail(superAdminEmail)
		if (!user) throw new NotFoundError()
		return await AuthUsersUseCases.updateRole({
			userId: user.id,
			roles: {
				[AuthRole.isAdmin]: true,
				[AuthRole.isSuperAdmin]: true
			}
		})
	}

	static async delete(req: Request) {
		const authUserId = req.authUser!.id
		const deleted = await AuthUsersUseCases.deleteUsers([authUserId])
		await signOutUser(authUserId)
		return deleted
	}
}