import { AuthUseCases, AuthUsersUseCases, generateAuthOutput, verifyReferrer } from '@modules/auth'
import { AuthTypes, Random, Request, Schema, Validation, ValidationError, validate } from 'equipped'

export class EmailsController {
	static async signup (req: Request) {
		const userCredential = {
			email: req.body.email ?? '',
			password: req.body.password
		}

		const users = await AuthUsersUseCases.findUsersByEmailorUsername(userCredential.email)
		const emailUser = users.find((u) => u.email === userCredential.email)

		const { email, password, referrer } = validate({
			email: Schema.string().email().addRule((value) => {
				const email = value as string
				if (!emailUser) return Validation.isValid(email)
				if (emailUser.authTypes.includes(AuthTypes.email)) return Validation.isInvalid(['this email already exists with a password attached'], email)
				if (emailUser.authTypes.includes(AuthTypes.google)) return Validation.isInvalid(['this email is associated with a google account. Try signing in with google'], email)
				if (emailUser.authTypes.includes(AuthTypes.apple)) return Validation.isInvalid(['this email is associated with an apple account. Try signing in with apple'], email)
				return Validation.isInvalid(['email already in use'], email)
			}),
			password: Schema.string().min(8).max(16),
			referrer: Schema.string().min(1).nullable().default(null)
		}, userCredential)

		const validateData = {
			name: { first: '', last: '' },
			username: Random.string(9), email, password, photo: null,
			referrer: await verifyReferrer(referrer)
		}

		const updatedUser = emailUser
			? await AuthUsersUseCases.updateDetails({ userId: emailUser.id, data: validateData })
			: await AuthUseCases.registerUser(validateData)

		return await generateAuthOutput(updatedUser)
	}

	static async signin (req: Request) {
		const validateData = validate({
			email: Schema.string(),
			password: Schema.string(),
		}, req.body)

		const data = await AuthUseCases.authenticateUser(validateData)
		return await generateAuthOutput(data)
	}

	static async sendVerificationMail (req: Request) {
		const user = await AuthUsersUseCases.findUserByEmail(req.authUser!.email)
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