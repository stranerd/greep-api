import { AuthUseCases } from '@modules/auth'
import { generateAuthOutput } from '@utils/modules/auth'
import { Request, Schema, validate } from 'equipped'

export class IdentitiesController {
	static async googleSignIn (req: Request) {
		const validatedData = validate({
			idToken: Schema.string(),
		}, req.body)

		const data = await AuthUseCases.googleSignIn(validatedData)
		return await generateAuthOutput(data)
	}

	static async appleSignIn (req: Request) {
		const validatedData = validate({
			firstName: Schema.string().nullable(),
			lastName: Schema.string().nullable(),
			email: Schema.string().nullable(),
			idToken: Schema.string(),
		}, req.body)

		const data = await AuthUseCases.appleSignIn(validatedData)
		return await generateAuthOutput(data)
	}
}