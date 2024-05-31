import { isAuthenticatedButIgnoreVerified } from '@application/middlewares'
import { AuthResponse, AuthUseCases, AuthUsersUseCases, generateAuthOutput, verifyReferrer } from '@modules/auth'
import { ApiDef, AuthTypes, Random, Router, Schema, Validation, ValidationError, validate } from 'equipped'

const router = new Router({ path: '/emails', tags: ['Emails'] })

router.post<SigninRouteDef>({ path: '/signin', key: 'emails-signin' })(async (req) => {
	const userCredential = {
		...req.body,
		email: req.body.email ?? '',
	}

	const users = await AuthUsersUseCases.findUsersByEmailorUsername(userCredential.email)
	const emailUser = users.find((u) => u.email === userCredential.email)

	const { email, password, referrer } = validate(
		{
			email: Schema.string()
				.email()
				.addRule((value) => {
					const email = value as string
					if (!emailUser) return Validation.isValid(email)
					if (emailUser.authTypes.includes(AuthTypes.email))
						return Validation.isInvalid(['this email already exists with a password attached'], email)
					if (emailUser.authTypes.includes(AuthTypes.google))
						return Validation.isInvalid(['this email is associated with a google account. Try signing in with google'], email)
					if (emailUser.authTypes.includes(AuthTypes.apple))
						return Validation.isInvalid(['this email is associated with an apple account. Try signing in with apple'], email)
					return Validation.isInvalid(['email already in use'], email)
				}),
			password: Schema.string().min(8).max(16),
			referrer: Schema.string().min(1).nullable().default(null),
		},
		userCredential,
	)

	const validateData = {
		name: { first: '', last: '' },
		username: Random.string(9),
		email,
		password,
		photo: null,
		referrer: await verifyReferrer(referrer),
		phone: null,
	}

	const updatedUser = emailUser
		? await AuthUsersUseCases.updateDetails({ userId: emailUser.id, data: validateData })
		: await AuthUseCases.registerUser(validateData)

	return await generateAuthOutput(updatedUser)
})

router.post<SignupRouteDef>({ path: '/signup', key: 'emails-signup' })(async (req) => {
	const userCredential = {
		...req.body,
		email: req.body.email ?? '',
	}

	const users = await AuthUsersUseCases.findUsersByEmailorUsername(userCredential.email)
	const emailUser = users.find((u) => u.email === userCredential.email)

	const { email, password, referrer } = validate(
		{
			email: Schema.string()
				.email()
				.addRule((value) => {
					const email = value as string
					if (!emailUser) return Validation.isValid(email)
					if (emailUser.authTypes.includes(AuthTypes.email))
						return Validation.isInvalid(['this email already exists with a password attached'], email)
					if (emailUser.authTypes.includes(AuthTypes.google))
						return Validation.isInvalid(['this email is associated with a google account. Try signing in with google'], email)
					if (emailUser.authTypes.includes(AuthTypes.apple))
						return Validation.isInvalid(['this email is associated with an apple account. Try signing in with apple'], email)
					return Validation.isInvalid(['email already in use'], email)
				}),
			password: Schema.string().min(8).max(16),
			referrer: Schema.string().min(1).nullable().default(null),
		},
		userCredential,
	)

	const validateData = {
		name: { first: '', last: '' },
		username: Random.string(9),
		email,
		password,
		photo: null,
		referrer: await verifyReferrer(referrer),
		phone: null,
	}

	const updatedUser = emailUser
		? await AuthUsersUseCases.updateDetails({ userId: emailUser.id, data: validateData })
		: await AuthUseCases.registerUser(validateData)

	return await generateAuthOutput(updatedUser)
})

router.post<SendVerifyMailRouteDef>({
	path: '/verify/mail',
	key: 'emails-send-verify-mail',
	middlewares: [isAuthenticatedButIgnoreVerified],
})(async (req) => {
	const user = await AuthUsersUseCases.findUserByEmail(req.authUser!.email)
	if (!user) throw new ValidationError([{ field: 'email', messages: ['No account with such email exists'] }])

	return await AuthUseCases.sendVerificationMail(user.email)
})

router.post<VerifyEmailRouteDef>({ path: '/verify', key: 'emails-verify-email' })(async (req) => {
	const { token } = validate(
		{
			token: Schema.force.string(),
		},
		req.body,
	)

	const data = await AuthUseCases.verifyEmail(token)
	return await generateAuthOutput(data)
})

export default router

type SigninRouteDef = ApiDef<{
	key: 'emails-signin'
	method: 'post'
	body: { email: string; password: string }
	response: AuthResponse
}>

type SignupRouteDef = ApiDef<{
	key: 'emails-signup'
	method: 'post'
	body: { email: string; password: string; referrer?: string | null }
	response: AuthResponse
}>

type SendVerifyMailRouteDef = ApiDef<{
	key: 'emails-send-verify-mail'
	method: 'post'
	response: boolean
}>

type VerifyEmailRouteDef = ApiDef<{
	key: 'emails-verify-email'
	method: 'post'
	body: { token: string }
	response: AuthResponse
}>
