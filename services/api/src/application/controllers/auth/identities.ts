import { AuthUseCases, generateAuthOutput, verifyReferrer } from '@modules/auth'
import { Request, Schema, validate } from 'equipped'

export class IdentitiesController {
	static async googleSignIn (req: Request) {
		const validatedData = validate({
			idToken: Schema.string(),
			referrer: Schema.string().nullable().default(null),
		}, req.body)

		const data = await AuthUseCases.googleSignIn({
			...validatedData,
			referrer: await verifyReferrer(validatedData.referrer)
		})
		return await generateAuthOutput(data)
	}

	static async appleSignIn (req: Request) {
		const { firstName, lastName, email, idToken, referrer } = validate({
			firstName: Schema.string().nullable(),
			lastName: Schema.string().nullable(),
			email: Schema.string().nullable(),
			idToken: Schema.string(),
			referrer: Schema.string().nullable().default(null),
		}, req.body)

		const data = await AuthUseCases.appleSignIn({
			data: { idToken, email, firstName, lastName },
			referrer: await verifyReferrer(referrer)
		})
		return await generateAuthOutput(data)
	}
}