import { isAuthenticated } from '@application/middlewares'
import { EntitySchema, InteractionEntity, MediaEntity, MediaUseCases, verifyInteraction } from '@modules/interactions'
import { StorageUseCases } from '@modules/storage'
import { UsersUseCases } from '@modules/users'
import {
	ApiDef,
	BadRequestError,
	FileSchema,
	NotAuthorizedError,
	NotFoundError,
	QueryParams,
	QueryResults,
	Router,
	Schema,
	validate,
} from 'equipped'

const schema = (fileRequired: boolean) => ({
	file: Schema.file().requiredIf(() => fileRequired),
})

const router = new Router({ path: '/media', groups: ['Media'] })

router.get<InteractionsMediaGetRouteDef>({ path: '/', key: 'interactions-media-get' })(async (req) => {
	const query = req.query
	return await MediaUseCases.get(query)
})

router.get<InteractionsMediaFindRouteDef>({ path: '/:id', key: 'interactions-media-find' })(async (req) => {
	const media = await MediaUseCases.find(req.params.id)
	if (!media) throw new NotFoundError()
	return media
})

router.post<InteractionsMediaCreateRouteDef>({ path: '/', key: 'interactions-media-create', middlewares: [isAuthenticated] })(
	async (req) => {
		const data = validate(
			{
				...schema(true),
				entity: EntitySchema(),
			},
			{ ...req.body, file: req.body.file?.at?.(0) ?? null },
		)

		const entity = await verifyInteraction(data.entity, 'media')
		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('profile not found')
		if (entity.userId !== user.id) throw new NotAuthorizedError()

		const file = await StorageUseCases.upload('interactions/media', data.file!)

		return await MediaUseCases.create({
			file,
			entity,
			user: user.getEmbedded(),
		})
	},
)

router.put<InteractionsMediaUpdateRouteDef>({ path: '/:id', key: 'interactions-media-update', middlewares: [isAuthenticated] })(
	async (req) => {
		const uploadedFile = req.body.file?.at?.(0) ?? null
		const changedFile = !!uploadedFile

		validate(schema(false), { ...req.body, file: uploadedFile })

		const file = uploadedFile ? await StorageUseCases.upload('interactions/media', uploadedFile) : undefined

		const updated = await MediaUseCases.update({
			id: req.params.id,
			userId: req.authUser!.id,
			data: {
				...(changedFile ? { file } : {}),
			},
		})
		if (updated) return updated
		throw new NotAuthorizedError()
	},
)

router.delete<InteractionsMediaDeleteRouteDef>({ path: '/:id', key: 'interactions-media-delete', middlewares: [isAuthenticated] })(
	async (req) => {
		const isDeleted = await MediaUseCases.delete({
			id: req.params.id,
			userId: req.authUser!.id,
		})
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	},
)

router.post<InteractionsMediaReorderRouteDef>({ path: '/reorder', key: 'interactions-media-reorder', middlewares: [isAuthenticated] })(
	async (req) => {
		const data = validate(
			{
				entity: EntitySchema(),
				ids: Schema.array(Schema.string().min(1)),
			},
			req.body,
		)

		const entity = await verifyInteraction(data.entity, 'media')
		if (entity.userId !== req.authUser!.id) throw new NotAuthorizedError()

		return await MediaUseCases.reorder({ entity, ids: data.ids })
	},
)

export default router

type InteractionsMediaGetRouteDef = ApiDef<{
	key: 'interactions-media-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<MediaEntity>
}>

type InteractionsMediaFindRouteDef = ApiDef<{
	key: 'interactions-media-find'
	method: 'get'
	params: { id: string }
	response: MediaEntity
}>

type InteractionsMediaCreateRouteDef = ApiDef<{
	key: 'interactions-media-create'
	method: 'post'
	body: { entity: Omit<InteractionEntity, 'userId'>; file: FileSchema }
	response: MediaEntity
}>

type InteractionsMediaUpdateRouteDef = ApiDef<{
	key: 'interactions-media-update'
	method: 'put'
	params: { id: string }
	body: { file?: FileSchema }
	response: MediaEntity
}>

type InteractionsMediaDeleteRouteDef = ApiDef<{
	key: 'interactions-media-delete'
	method: 'delete'
	params: { id: string }
	response: boolean
}>

type InteractionsMediaReorderRouteDef = ApiDef<{
	key: 'interactions-media-reorder'
	method: 'post'
	body: { entity: Omit<InteractionEntity, 'userId'>; ids: string[] }
	response: MediaEntity[]
}>
