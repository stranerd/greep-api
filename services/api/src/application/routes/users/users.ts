import { isAdmin, isAuthenticated, isAuthenticatedButIgnoreVerified } from '@application/middlewares'
import { ApiDef, NotAuthorizedError, NotFoundError, QueryParams, QueryResults, Router, Schema, validate } from 'equipped'
import { UserEntity, UserType, UserVendorType, UsersUseCases } from '@modules/users'
import { Location, LocationSchema } from '@utils/types'
import { StorageUseCases } from '@modules/storage'

const router = new Router({ path: '/users', groups: ['Users'] })

router.get<UsersGetRouteDef>({ path: '/', key: 'users-users-get' })(async (req) => {
	const query = req.query
	query.auth = [{ field: 'dates.deletedAt', value: null }]
	return await UsersUseCases.get(query)
})

router.get<UsersFindRouteDef>({ path: '/:id', key: 'users-users-find' })(async (req) => {
	const user = await UsersUseCases.find(req.params.id)
	if (!user || user.isDeleted()) throw new NotFoundError()
	return user
})

router.post<UsersUpdateTypeRouteDef>({ path: '/type', key: 'users-users-update-type', middlewares: [isAuthenticatedButIgnoreVerified] })(
	async (req) => {
		const license = req.files.license?.at(0)
		const passport = req.files.passport?.at(0)
		const studentId = req.files.studentId?.at(0)
		const residentPermit = req.files.residentPermit?.at(0)
		const roles = req.authUser!.roles

		const { data } = validate(
			{
				data: Schema.discriminate((v) => v.type, {
					[UserType.driver]: Schema.object({
						type: Schema.is(UserType.driver as const),
						license: Schema.file().image(),
					}),
					[UserType.vendor]: Schema.object({
						type: Schema.is(UserType.vendor as const),
						vendorType: roles.isVendorFoods
							? Schema.is(UserVendorType.foods, (val, comp) => val === comp, 'you cannot change your vendor type')
							: roles.isVendorItems
								? Schema.is(UserVendorType.items, (val, comp) => val === comp, 'you cannot change your vendor type')
								: Schema.in(Object.values(UserVendorType)),
						name: Schema.string().min(1),
						email: Schema.string().email().nullable(),
						website: Schema.string().url().nullable(),
						location: LocationSchema(),
					}),
					[UserType.customer]: Schema.object({
						type: Schema.is(UserType.customer as const),
						passport: Schema.file()
							.image()
							.requiredIf(() => !studentId && !residentPermit),
						studentId: Schema.file()
							.image()
							.requiredIf(() => !passport && !residentPermit),
						residentPermit: Schema.file()
							.image()
							.requiredIf(() => !passport && !studentId),
					}),
				}),
			},
			{
				data: {
					...req.body,
					license,
					passport,
					studentId,
					residentPermit,
				},
			},
		)

		if (data.type === UserType.driver) {
			const license = await StorageUseCases.upload('users/drivers/licenses', data.license)
			const updated = await UsersUseCases.updateType({ userId: req.authUser!.id, data: { ...data, license } })
			if (updated) return updated
		} else if (data.type === UserType.vendor) {
			const updated = await UsersUseCases.updateType({ userId: req.authUser!.id, data: { ...data } })
			if (updated) return updated
		} else if (data.type === UserType.customer) {
			const passport = data.passport ? await StorageUseCases.upload('users/customers/passport', data.passport) : null
			const studentId = data.studentId ? await StorageUseCases.upload('users/customers/studentId', data.studentId) : null
			const residentPermit = data.residentPermit
				? await StorageUseCases.upload('users/customers/residentPermit', data.residentPermit)
				: null
			const updated = await UsersUseCases.updateType({
				userId: req.authUser!.id,
				data: { ...data, passport, studentId, residentPermit },
			})
			if (updated) return updated
		}

		throw new NotAuthorizedError('cannot update user type')
	},
)

router.post<UsersUpdateApplicationRouteDef>({ path: '/application', key: 'users-users-update-application', middlewares: [isAdmin] })(
	async (req) => {
		const { userId, accepted, message } = validate(
			{
				userId: Schema.string(),
				accepted: Schema.boolean(),
				message: Schema.string(),
			},
			req.body,
		)

		const updated = await UsersUseCases.updateApplication({ userId, data: { accepted, message } })
		if (updated) return updated
		throw new NotAuthorizedError('cannot update user application')
	},
)

router.post<UsersUpdateLocationRouteDef>({ path: '/location', key: 'users-users-update-location', middlewares: [isAuthenticated] })(
	async (req) => {
		const { location } = validate({ location: Schema.tuple([Schema.number(), Schema.number()]) }, req.body)

		const updated = await UsersUseCases.updateLocation({ userId: req.authUser!.id, location })
		if (updated) return updated
		throw new NotAuthorizedError('cannot update user location')
	},
)

router.post<UsersUpdateDriverAvailabilityRouteDef>({
	path: '/driverAvailability',
	key: 'users-users-update-driver-availability',
	middlewares: [isAuthenticated],
})(async (req) => {
	const { available } = validate({ available: Schema.boolean() }, req.body)
	const user = await UsersUseCases.updateSettings({ userId: req.authUser!.id, settings: { driverAvailable: available } })
	return !!user
})

router.post<UsersUpdateSavedLocationsRouteDef>({
	path: '/savedLocations',
	key: 'users-users-update-saved-locations',
	middlewares: [isAuthenticated],
})(async (req) => {
	const { locations: savedLocations } = validate({ locations: Schema.array(LocationSchema()) }, req.body)

	const user = await UsersUseCases.updateSavedLocations({ userId: req.authUser!.id, savedLocations })
	if (user) return user
	throw new NotAuthorizedError('cannot update user saved locations')
})

export default router

type UsersGetRouteDef = ApiDef<{
	key: 'users-users-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<UserEntity>
}>

type UsersFindRouteDef = ApiDef<{
	key: 'users-users-find'
	method: 'get'
	params: { id: string }
	response: UserEntity
}>

type UsersUpdateTypeRouteDef = ApiDef<{
	key: 'users-users-update-type'
	method: 'post'
	body:
		| { type: UserType.driver | UserType.customer }
		| {
				type: UserType.vendor
				vendorType: UserVendorType
				name: string
				email?: string
				website?: string
				location: Location
		  }
	files: { license?: false; passport?: false; studentId?: false; residentPermit?: false }
	response: UserEntity
}>

type UsersUpdateApplicationRouteDef = ApiDef<{
	key: 'users-users-update-application'
	method: 'post'
	body: { userId: string; accepted: boolean; message: string }
	response: boolean
}>

type UsersUpdateLocationRouteDef = ApiDef<{
	key: 'users-users-update-location'
	method: 'post'
	body: { location: [number, number] }
	response: boolean
}>

type UsersUpdateDriverAvailabilityRouteDef = ApiDef<{
	key: 'users-users-update-driver-availability'
	method: 'post'
	body: { available: boolean }
	response: boolean
}>

type UsersUpdateSavedLocationsRouteDef = ApiDef<{
	key: 'users-users-update-saved-locations'
	method: 'post'
	body: { locations: Location[] }
	response: UserEntity
}>
