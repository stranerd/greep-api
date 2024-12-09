import { isAdmin, isAuthenticated, isAuthenticatedButIgnoreVerified, isVendor } from '@application/middlewares'
import { StorageUseCases } from '@modules/storage'
import { BusinessTime, UserEntity, UserType, UserVendorBusinessDays, UserVendorType, UsersUseCases } from '@modules/users'
import { LocationInput, LocationSchema, TimeSchema, Tz, timezones } from '@utils/types'
import {
	ApiDef,
	BadRequestError,
	FileSchema,
	MediaOutput,
	NotAuthorizedError,
	NotFoundError,
	QueryParams,
	QueryResults,
	Router,
	Schema,
	validate,
} from 'equipped'

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
		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user) throw new NotFoundError('user not found')
		const type = user.type

		const data = validate(
			Schema.discriminate((v) => v.type, {
				[UserType.driver]: Schema.object({
					type: Schema.is(UserType.driver as const),
					license: Schema.file().image().nullish(),
				}),
				[UserType.vendor]: Schema.object({
					type: Schema.is(UserType.vendor as const),
					vendorType: Schema.in(type && 'vendorType' in type ? [type.vendorType] : Object.values(UserVendorType)),
					name: Schema.string().min(1),
					banner: Schema.file().image().nullish(),
					email: Schema.string().email().nullable(),
					contactNumber: Schema.string().min(10),
					website: Schema.string().url().nullable(),
					location: LocationSchema(),
					passport: Schema.file().image().nullish(),
					residentPermit: Schema.file().image().nullish(),
				}),
				[UserType.customer]: Schema.object({
					type: Schema.is(UserType.customer as const),
					passport: Schema.file().image().nullish(),
					studentId: Schema.file().image().nullish(),
					residentPermit: Schema.file().image().nullish(),
				}),
			}),
			{
				...req.body,
				// @ts-ignore
				license: req.body.license?.at?.(0),
				// @ts-ignore
				banner: req.body.banner?.at?.(0),
				// @ts-ignore
				passport: req.body.passport?.at?.(0),
				// @ts-ignore
				studentId: req.body.studentId?.at?.(0),
				// @ts-ignore
				residentPermit: req.body.residentPermit?.at?.(0),
			},
		)

		if (type && data.type !== type.type) throw new BadRequestError('cannot change user type')

		const getFileValue = async (key: string, uploadPath: string) => {
			if (data[key]?.data instanceof Uint8Array) return StorageUseCases.upload(uploadPath, data[key])
			if (data[key] === null) return null
			if (type?.[key]) return type[key] as MediaOutput
			return null
		}

		if (data.type === UserType.driver) {
			const license = await getFileValue('license', 'users/drivers/licenses')
			if (!license) throw new BadRequestError('license file is required')

			const updated = await UsersUseCases.updateType({ userId: req.authUser!.id, data: { ...data, license } })
			if (updated) return updated
		} else if (data.type === UserType.vendor) {
			const banner = await getFileValue('banner', 'users/vendors/banners')
			const passport = await getFileValue('passport', 'users/vendors/passport')
			const residentPermit = await getFileValue('residentPermit', 'users/vendors/residentPermit')

			const updated = await UsersUseCases.updateType({
				userId: req.authUser!.id,
				data: { ...data, banner, passport, residentPermit },
			})
			if (updated) return updated
		} else if (data.type === UserType.customer) {
			const passport = await getFileValue('passport', 'users/customers/passport')
			const studentId = await getFileValue('studentId', 'users/customers/studentId')
			const residentPermit = await getFileValue('residentPermit', 'users/customers/residentPermit')
			if (!passport && !studentId && !residentPermit)
				throw new BadRequestError('at least one of the passport, studentId, residentPermit is required')

			const updated = await UsersUseCases.updateType({
				userId: req.authUser!.id,
				data: { ...data, passport, studentId, residentPermit },
			})
			if (updated) return updated
		}

		throw new BadRequestError('cannot update user type')
	},
)

router.post<UsersUpdateApplicationRouteDef>({
	path: '/application',
	key: 'users-users-update-application',
	middlewares: [isAuthenticated, isAdmin],
})(async (req) => {
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
})

router.post<UsersUpdateLocationRouteDef>({ path: '/location', key: 'users-users-update-location', middlewares: [isAuthenticated] })(
	async (req) => {
		const { location } = validate({ location: LocationSchema() }, req.body)

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

router.get<UsersGetSupportedTimezonesRouteDef>({
	path: '/vendors/timezones',
	key: 'users-users-timezones',
})(() => timezones)

router.post<UsersUpdateVendorScheduleRouteDef>({
	path: '/vendors/schedule',
	key: 'users-users-update-vendor-schedule',
	middlewares: [isAuthenticated, isVendor],
})(async (req) => {
	const scheduleSchema = Schema.object({ from: TimeSchema(), to: TimeSchema() }).nullable()
	const { schedule } = validate(
		{
			schedule: Schema.object({
				timezone: Schema.string().in(timezones.map((tz) => tz.id)),
				schedule: Schema.object({
					[UserVendorBusinessDays.sun]: scheduleSchema,
					[UserVendorBusinessDays.mon]: scheduleSchema,
					[UserVendorBusinessDays.tue]: scheduleSchema,
					[UserVendorBusinessDays.wed]: scheduleSchema,
					[UserVendorBusinessDays.thu]: scheduleSchema,
					[UserVendorBusinessDays.fri]: scheduleSchema,
					[UserVendorBusinessDays.sat]: scheduleSchema,
				}),
			}).nullable(),
		},
		req.body,
	)

	const user = await UsersUseCases.updateVendor({ userId: req.authUser!.id, type: 'schedule', data: schedule })
	if (user) return user
	throw new NotAuthorizedError('cannot update user schedule')
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
		| { type: UserType.driver; license: FileSchema }
		| { type: UserType.customer; passport?: FileSchema; studentId?: FileSchema; residentPermit?: FileSchema }
		| {
				type: UserType.vendor
				vendorType: UserVendorType
				name: string
				banner?: FileSchema | null
				email: string | null
				contactNumber: string | null
				website: string | null
				location: LocationInput
				passport?: FileSchema | null
				residentPermit?: FileSchema | null
		  }
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
	body: { location: LocationInput }
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
	body: { locations: LocationInput[] }
	response: UserEntity
}>

type UsersGetSupportedTimezonesRouteDef = ApiDef<{
	key: 'users-users-timezones'
	method: 'get'
	response: Tz[]
}>

type UsersUpdateVendorScheduleRouteDef = ApiDef<{
	key: 'users-users-update-vendor-schedule'
	method: 'post'
	body: { schedule: BusinessTime }
	response: UserEntity
}>
