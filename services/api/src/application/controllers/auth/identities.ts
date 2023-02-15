import { AuthUseCases } from '@modules/auth'
import { Request, validate, Validation } from 'equipped'
import { generateAuthOutput } from '@utils/modules/auth'

export class IdentitiesController {
	static async googleSignIn(req: Request) {
		const validatedData = validate({
			idToken: req.body.idToken
		}, {
			idToken: { required: true, rules: [Validation.isString()] }
		})

		const data = await AuthUseCases.googleSignIn(validatedData)
		return await generateAuthOutput(data)
	}

	static async appleSignIn(req: Request) {
		const validatedData = validate({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			idToken: req.body.idToken
		}, {
			firstName: { required: true, nullable: true, rules: [Validation.isString()] },
			lastName: { required: true, nullable: true, rules: [Validation.isString()] },
			email: { required: true, nullable: true, rules: [Validation.isString()] },
			idToken: { required: true, rules: [Validation.isString()] }
		})

		const data = await AuthUseCases.appleSignIn(validatedData)
		return await generateAuthOutput(data)
	}
}