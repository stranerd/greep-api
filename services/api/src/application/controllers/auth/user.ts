import { AuthUsersUseCases } from '@modules/auth'
import { StorageUseCases } from '@modules/storage'
import { AuthRole, BadRequestError, NotFoundError, Request, validate, Validation, verifyAccessToken } from '@stranerd/api-commons'
import { superAdminEmail } from '@utils/environment'
import { signOutUser } from '@utils/modules/auth'

const roles = Object.values(AuthRole).filter((key) => key !== AuthRole.isSuperAdmin)

export class UserController {
	static async findUser (req: Request) {
		const userId = req.authUser!.id
		return await AuthUsersUseCases.findUser(userId)
	}

	static async updateUser (req: Request) {
		const userId = req.authUser!.id
		const uploadedPhoto = req.files.photo?.[0] ?? null
		const changedPhoto = !!uploadedPhoto || req.body.photo === null
		const data = validate({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			photo: uploadedPhoto as any
		}, {
			firstName: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			lastName: { required: true, rules: [Validation.isString] },
			photo: { required: true, nullable: true, rules: [Validation.isNotTruncated, Validation.isImage] }
		})
		const { firstName, lastName } = data
		if (uploadedPhoto) data.photo = await StorageUseCases.upload('profiles', uploadedPhoto)

		const validateData = {
			name: { first: firstName, last: lastName },
			...(changedPhoto ? { photo: data.photo } : {})
		}

		return await AuthUsersUseCases.updateProfile({ userId, data: validateData as any })
	}

	static async updateUserRole (req: Request) {
		const { role, userId, value } = validate({
			role: req.body.role,
			userId: req.body.userId,
			value: req.body.value
		}, {
			role: {
				required: true,
				rules: [Validation.isString, Validation.arrayContainsX(roles, (cur, val) => cur === val)]
			},
			value: { required: true, rules: [Validation.isBoolean] },
			userId: { required: true, rules: [Validation.isString] }
		})

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