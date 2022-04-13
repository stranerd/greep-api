import { FindUser, FindUserByEmail, UpdateUserProfile, UpdateUserRole } from '@modules/auth'
import { NotFoundError, Request, validate, Validation, verifyAccessToken } from '@stranerd/api-commons'
import { signOutUser } from '@utils/modules/auth'
import { superAdminEmail } from '@utils/environment'

export class UserController {
	static async findUser (req: Request) {
		const userId = req.authUser!.id
		return await FindUser.execute(userId)
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

		return await UpdateUserProfile.execute({ userId, data: validateData })
	}

	static async updateUserRole (req: Request) {
		const validateData = validate({
			role: req.body.role,
			userId: req.body.userId,
			value: req.body.value
		}, {
			role: { required: true, rules: [Validation.isString] },
			value: { required: true, rules: [Validation.isBoolean] },
			userId: { required: true, rules: [Validation.isString] }
		})

		return await UpdateUserRole.execute(validateData)
	}

	static async signout (req: Request) {
		const user = await verifyAccessToken(req.headers.AccessToken ?? '').catch(() => null)
		return await signOutUser(user?.id ?? '')
	}

	static async superAdmin (_: Request) {
		const user = await FindUserByEmail.execute(superAdminEmail)
		if (!user) throw new NotFoundError()
		const res = await Promise.all(
			['isAdmin', 'isSuperAdmin'].map(async (role) => await UpdateUserRole.execute({
				role,
				userId: user.id,
				value: true
			}))
		)
		return res.every((r) => r)
	}
}