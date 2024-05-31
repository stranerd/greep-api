import { AuthResponse, AuthUseCases, generateAuthOutput, verifyReferrer } from '@modules/auth'
import { ApiDef, Router, Schema, validate } from 'equipped'

const router = new Router({ path: '/identities', tags: ['Identities'] })
router.post<GoogleRouteDef>({ path: '/google', key: 'identities-google' })(async (req) => {
	const validatedData = validate(
		{
			idToken: Schema.string(),
			referrer: Schema.string().nullable().default(null),
		},
		req.body,
	)

	const data = await AuthUseCases.googleSignIn({
		...validatedData,
		referrer: await verifyReferrer(validatedData.referrer),
	})
	return await generateAuthOutput(data)
})

router.post<AppleRouteDef>({ path: '/apple', key: 'identities-apple' })(async (req) => {
	const { firstName, lastName, email, idToken, referrer } = validate(
		{
			firstName: Schema.string().nullable(),
			lastName: Schema.string().nullable(),
			email: Schema.string().nullable(),
			idToken: Schema.string(),
			referrer: Schema.string().nullable().default(null),
		},
		req.body,
	)

	const data = await AuthUseCases.appleSignIn({
		data: { idToken, email, firstName, lastName },
		referrer: await verifyReferrer(referrer),
	})
	return await generateAuthOutput(data)
})

export default router

type GoogleRouteDef = ApiDef<{
	key: 'identities-google'
	method: 'post'
	body: { idToken: string; referrer?: string | null }
	response: AuthResponse
}>

type AppleRouteDef = ApiDef<{
	key: 'identities-apple'
	method: 'post'
	body: { idToken: string; firstName: string | null; lastName: string | null; email: string | null; referrer?: string | null }
	response: AuthResponse
}>
