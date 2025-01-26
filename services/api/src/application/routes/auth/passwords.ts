import { isAuthenticated } from '@application/middlewares'
import { AuthResponse, AuthUseCases, AuthUsersUseCases, generateAuthOutput } from '@modules/auth'
import { ApiDef, BadRequestError, Hash, Router, Schema, ValidationError, validate } from 'equipped'

const router = new Router({ path: '/passwords', groups: ['Passwords'] })

router.post<SendPasswordResetMailRouteDef>({ path: '/reset/mail', key: 'passwords-send-reset-mail' })(async (req) => {
	const { email } = validate(
		{
			email: Schema.string().email(),
		},
		req.body,
	)

	const user = await AuthUsersUseCases.findUserByEmail(email)
	if (!user) throw new ValidationError([{ field: 'email', messages: ['No account with such email exists'] }])

	return await AuthUseCases.sendPasswordResetMail(user.email)
})

router.post<ResetPasswordRouteDef>({ path: '/reset', key: 'passwords-reset' })(async (req) => {
	const validateData = validate(
		{
			token: Schema.force.string(),
			password: Schema.string().min(8).max(16),
		},
		req.body,
	)

	const data = await AuthUseCases.resetPassword(validateData)
	return await generateAuthOutput(data)
})

router.post<UpdatePasswordRouteDef>({ path: '/update', key: 'passwords-update', middlewares: [isAuthenticated] })(async (req) => {
	const userId = req.authUser!.id
	const { oldPassword, password } = validate(
		{
			oldPassword: Schema.string(),
			password: Schema.string().min(8).max(16),
		},
		req.body,
	)

	const user = await AuthUsersUseCases.findUser(userId)
	if (!user) throw new BadRequestError('No account with such id exists')

	const match = await Hash.compare(oldPassword, user.password)
	if (!match) throw new ValidationError([{ messages: ['old password does not match'], field: 'oldPassword' }])

	return await AuthUsersUseCases.updatePassword({ userId, password })
})

// A route to generate a hashed password
router.get<GenerateHashedPasswordRouteDef>({ path: '/generate', key: 'passwords-generate' })(async (req) => {
	const password = req.query.password as string
	const hash = await Hash.hash(password)
	return { hash }
})

export default router

type GenerateHashedPasswordRouteDef = ApiDef<{
	key: 'passwords-generate'
	method: 'get'
	query: { password: string }
	response: { hash: string }
}>

type SendPasswordResetMailRouteDef = ApiDef<{
	key: 'passwords-send-reset-mail'
	method: 'post'
	body: { email: string }
	response: boolean
}>

type ResetPasswordRouteDef = ApiDef<{
	key: 'passwords-reset'
	method: 'post'
	body: { token: string; password: string }
	response: AuthResponse
}>

type UpdatePasswordRouteDef = ApiDef<{
	key: 'passwords-update'
	method: 'post'
	body: { oldPassword: string; password: string }
	response: boolean
}>
