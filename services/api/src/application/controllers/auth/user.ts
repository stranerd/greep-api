import { AuthUsersUseCases } from '@modules/auth'
import { NotFoundError, Request, validate, Validation, verifyAccessToken } from '@stranerd/api-commons'
import { signOutUser } from '@utils/modules/auth'
import { superAdminEmail } from '@utils/environment'
import { SupportedAuthRoles } from '@utils/types/auth'

export class UserController {
	static async findUser (req: Request) {
		const userId = req.authUser!.id
		return await AuthUsersUseCases.findUser(userId)
	}

	static async updateUser (req: Request) {
		const userId = req.authUser!.id
		const { firstName, middleName, lastName, photo, coverPhoto, description } = validate({
			firstName: req.body.firstName,
			middleName: req.body.middleName,
			lastName: req.body.lastName,
			description: req.body.description,
			photo: req.body.photo,
			coverPhoto: req.body.coverPhoto
		}, {
			firstName: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			middleName: { required: true, rules: [Validation.isString] },
			lastName: { required: true, rules: [Validation.isString] },
			description: { required: true, rules: [Validation.isString] },
			photo: { required: false, rules: [Validation.isImage] },
			coverPhoto: { required: false, rules: [Validation.isImage] }
		})
		const validateData = {
			name: { first: firstName, middle: middleName, last: lastName },
			photo, coverPhoto, description
		}

		return await AuthUsersUseCases.updateProfile({ userId, data: validateData })
	}

	static async updateUserRole (req: Request) {
		const { role, userId, value } = validate({
			role: req.body.role,
			userId: req.body.userId,
			value: req.body.value
		}, {
			role: {
				required: true,
				rules: [Validation.isString, Validation.arrayContainsX(Object.values<string>(SupportedAuthRoles), (cur, val) => cur === val)]
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
				isSuperAdmin: true
			}
		})
	}
}