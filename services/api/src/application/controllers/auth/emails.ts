import { AuthUseCases, AuthUsersUseCases } from '@modules/auth'
import { StorageUseCases } from '@modules/storage'
import { generateAuthOutput } from '@utils/modules/auth'
import { AuthTypes, Request, Schema, validate, Validation, ValidationError } from 'equipped'

export class EmailsController {
	static async signup (req: Request) {
		const userCredential = {
			email: req.body.email ?? '',
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			password: req.body.password,
			photo: req.files.photo?.[0] ?? null
		}

		const user = await AuthUsersUseCases.findUserByEmail(userCredential.email)

		const { email, firstName, lastName, password, photo: userPhoto } = validate({
			email: Schema.string().email().addRule((value) => {
				const email = value as string
				if (!user) return Validation.isValid(email)
				if (user.authTypes.includes(AuthTypes.email)) return Validation.isInvalid(['this email already exists with a password attached'], email)
				if (user.authTypes.includes(AuthTypes.google)) return Validation.isInvalid(['this email is associated with a google account. Try signing in with google'], email)
				return Validation.isInvalid(['email already in use'], email)
			}),
			password: Schema.string().min(8).max(16),
			photo: Schema.file().image().nullable(),
			firstName: Schema.string().min(1),
			lastName: Schema.string().min(1)
		}, userCredential)

		const photo = userPhoto ? await StorageUseCases.upload('profiles/photos', userPhoto) : null
		const validateData = {
			name: { first: firstName, last: lastName },
			email, password, photo
		}

		const updatedUser = user
			? await AuthUsersUseCases.updateDetails({ userId: user.id, data: validateData })
			: await AuthUseCases.registerUser(validateData)

		return await generateAuthOutput(updatedUser)
	}

	static async signin (req: Request) {
		const validateData = validate({
			email: Schema.string().email(),
			password: Schema.string(),
		}, req.body)

		const data = await AuthUseCases.authenticateUser(validateData)
		return await generateAuthOutput(data)
	}

	static async sendVerificationMail (req: Request) {
		const { email } = validate({
			email: Schema.string().email()
		}, req.body)

		const user = await AuthUsersUseCases.findUserByEmail(email)
		if (!user) throw new ValidationError([{ field: 'email', messages: ['No account with such email exists'] }])

		return await AuthUseCases.sendVerificationMail(user.email)
	}

	static async verifyEmail (req: Request) {
		const { token } = validate({
			token: Schema.force.string()
		}, req.body)

		const data = await AuthUseCases.verifyEmail(token)
		return await generateAuthOutput(data)
	}
}