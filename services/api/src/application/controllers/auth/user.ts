import { AuthUsersUseCases } from '@modules/auth'
import { NotFoundError, Request, validate, Validation, verifyAccessToken } from '@stranerd/api-commons'
import { signOutUser } from '@utils/modules/auth'
import { superAdminEmail } from '@utils/environment'
import { SupportedAuthRoles } from '@utils/types/auth'
import { isNotTruncated } from '@utils/hash'
import { StorageUseCases } from '@modules/storage'

const roles = Object.values<string>(SupportedAuthRoles).filter((key) => key !== SupportedAuthRoles.isSuperAdmin)

export class UserController {
	static async findUser (req: Request) {
		const userId = req.authUser!.id
		return await AuthUsersUseCases.findUser(userId)
	}

	static async updateUser (req: Request) {
		const userId = req.authUser!.id
		const uploadedPhoto = req.files.photo?.[0]
		const changedPhoto = !!uploadedPhoto || req.body.photo === null
		const data = validate({
			firstName: req.body.firstName,
			middleName: req.body.middleName,
			lastName: req.body.lastName,
			description: req.body.description,
			photo: uploadedPhoto as any
		}, {
			firstName: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			middleName: { required: true, rules: [Validation.isString] },
			lastName: { required: true, rules: [Validation.isString] },
			description: { required: true, rules: [Validation.isString] },
			photo: { required: false, rules: [isNotTruncated, Validation.isImage] }
		})
		const { firstName, middleName, lastName, description } = data
		if (uploadedPhoto) data.photo = await StorageUseCases.upload('profiles', uploadedPhoto)

		const validateData = {
			name: { first: firstName, middle: middleName, last: lastName },
			description, ...(changedPhoto ? { photo: data.photo } : {})
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
				[SupportedAuthRoles.isAdmin]: true,
				[SupportedAuthRoles.isSuperAdmin]: true
			}
		})
	}
}