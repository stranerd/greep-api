import { AuthUserEntity, AuthUsersUseCases, Phone, signOutUser } from '@modules/auth'
import { StorageUseCases } from '@modules/storage'
import { superAdminEmail } from '@utils/environment'
import {
	ApiDef,
	AuthRole,
	AuthRoles,
	BadRequestError,
	FileSchema,
	NotFoundError,
	Router,
	Schema,
	Validation,
	validate,
	verifyAccessToken,
} from 'equipped'
import { isAdmin, isAuthenticated, isAuthenticatedButIgnoreVerified } from '../../middlewares'

const router = new Router({ path: '/user', groups: ['User'] })

router.get<GetAuthUserRouteDef>({ path: '/', key: 'user-get', middlewares: [isAuthenticatedButIgnoreVerified] })(async (req) => {
	const userId = req.authUser!.id
	const user = await AuthUsersUseCases.findUser(userId)
	if (!user) throw new NotFoundError('profile not found')
	return user
})

router.put<UpdateAuthUserRouteDef>({ path: '/', key: 'user-update', middlewares: [isAuthenticated] })(async (req) => {
	const userId = req.authUser!.id
	const uploadedPhoto = req.body.photo?.[0] ?? null
	const changedPhoto = !!uploadedPhoto || req.body.photo === null

	req.body.username = req.body.username?.toLowerCase() ?? ''
	const users = await AuthUsersUseCases.findUsersByEmailorUsername(req.body.username)
	const usernameUser = users.find((u) => u.username === req.body.username)

	const data = validate(
		{
			firstName: Schema.string().min(1),
			lastName: Schema.string().min(1),
			username: Schema.string()
				.min(4)
				.addRule((value) => {
					const username = value as string
					if (!usernameUser || usernameUser.id === userId) return Validation.isValid(username)
					return Validation.isInvalid(['username already in use'], username)
				}),
			photo: Schema.file().image().nullable(),
			phone: Schema.any().addRule(Validation.isValidPhone()).nullable(),
		},
		{ ...req.body, photo: uploadedPhoto },
	)
	const { firstName, lastName, username, phone } = data
	const photo = uploadedPhoto ? await StorageUseCases.upload('profiles', uploadedPhoto) : undefined

	return await AuthUsersUseCases.updateProfile({
		userId,
		data: {
			name: { first: firstName, last: lastName },
			username,
			phone,
			...((changedPhoto ? { photo } : {}) as any),
		},
	})
})

router.delete<DeleteUserRouteDef>({ path: '/', key: 'user-delete', middlewares: [isAuthenticated] })(async (req) => {
	const authUserId = req.authUser!.id
	const deleted = await AuthUsersUseCases.deleteUsers([authUserId])
	await signOutUser(authUserId)
	return deleted
})

router.put<UpdateUserRolesRouteDef>({ path: '/roles', key: 'user-update-roles', middlewares: [isAuthenticated, isAdmin] })(async (req) => {
	const { role, userId, value } = validate(
		{
			role: Schema.in(Object.values(AuthRole).filter((key) => key !== AuthRole.isSuperAdmin)),
			userId: Schema.string().min(1),
			value: Schema.boolean(),
		},
		req.body,
	)

	if (req.authUser!.id === userId) throw new BadRequestError('You cannot modify your own roles')

	return await AuthUsersUseCases.updateRole({
		userId,
		roles: { [role]: value },
	})
})

router.post<SignoutRouteDef>({ path: '/signout', key: 'user-signout' })(async (req) => {
	const user = await verifyAccessToken(req.headers.AccessToken ?? '').catch(() => null)
	return await signOutUser(user?.id ?? '')
})

router.get<SetSuperAdminRouteDef>({ path: '/superAdmin', key: 'user-super-admin' })(async () => {
	const user = await AuthUsersUseCases.findUserByEmail(superAdminEmail)
	if (!user) throw new NotFoundError()
	return await AuthUsersUseCases.updateRole({
		userId: user.id,
		roles: {
			[AuthRole.isAdmin]: true,
			[AuthRole.isSuperAdmin]: true,
		},
	})
})

export default router

type GetAuthUserRouteDef = ApiDef<{
	key: 'user-get'
	method: 'get'
	response: AuthUserEntity
}>

type UpdateAuthUserRouteDef = ApiDef<{
	key: 'user-update'
	method: 'put'
	body: { firstName: string; lastName: string; username: string; phone: Phone | null; photo?: FileSchema | null }
	response: AuthUserEntity
}>

type DeleteUserRouteDef = ApiDef<{
	key: 'user-delete'
	method: 'delete'
	response: boolean
}>

type UpdateUserRolesRouteDef = ApiDef<{
	key: 'user-update-roles'
	method: 'put'
	body: { role: AuthRoles; userId: string; value: boolean }
	response: boolean
}>

type SignoutRouteDef = ApiDef<{
	key: 'user-signout'
	method: 'post'
	response: boolean
}>

type SetSuperAdminRouteDef = ApiDef<{
	key: 'user-super-admin'
	method: 'get'
	response: boolean
}>
