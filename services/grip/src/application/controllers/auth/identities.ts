import { GoogleSignIn } from '@modules/auth'
import { Request, validate, Validation } from '@stranerd/api-commons'
import { generateAuthOutput } from '@utils/modules/auth'

export class IdentitiesController {
	static async googleSignIn (req: Request) {
		const validatedData = validate({
			idToken: req.body.idToken,
			referrer: req.body.referrer,
			clientId: req.body.clientId
		}, {
			idToken: { required: true, rules: [Validation.isString] },
			referrer: { required: false, rules: [Validation.isString] },
			clientId: { required: true, rules: [Validation.isString] }
		})

		const data = await GoogleSignIn.execute(validatedData)
		return await generateAuthOutput(data)
	}
}