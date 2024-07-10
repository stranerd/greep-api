import { isAdmin, isAuthenticated } from '@application/middlewares'
import { TagEntity, TagTypes, TagsUseCases } from '@modules/interactions'
import { StorageUseCases } from '@modules/storage'
import { ApiDef, FileSchema, NotAuthorizedError, NotFoundError, QueryParams, QueryResults, Router, Schema, validate } from 'equipped'

const schema = () => ({
	title: Schema.string().min(1),
	photo: Schema.file().image().nullable(),
})

const router = new Router({ path: '/tags', groups: ['Tags'] })

router.get<InteractionsTagsGetRouteDef>({ path: '/', key: 'interactions-tags-get' })(async (req) => {
	const query = req.query
	return await TagsUseCases.get(query)
})

router.get<InteractionsTagsFindRouteDef>({ path: '/:id', key: 'interactions-tags-find' })(async (req) => {
	const tag = await TagsUseCases.find(req.params.id)
	if (!tag) throw new NotFoundError()
	return tag
})

router.post<InteractionsTagsCreateRouteDef>({ path: '/', key: 'interactions-tags-create', middlewares: [isAuthenticated] })(async (req) => {
	const data = validate({ ...schema(), type: Schema.in(Object.values(TagTypes)) }, { ...req.body, photo: req.body.photo?.at(0) ?? null })

	// if (data.parent !== null) throw new BadRequestError('no tag type can have children')

	const photo = data.photo ? await StorageUseCases.upload('interactions/tags', data.photo) : null

	return await TagsUseCases.add({ ...data, photo, parent: null })
})

router.put<InteractionsTagsUpdateRouteDef>({ path: '/:id', key: 'interactions-tags-update', middlewares: [isAuthenticated, isAdmin] })(
	async (req) => {
		const uploadedPhoto = req.body.photo?.[0] ?? null
		const changedPhoto = !!uploadedPhoto || req.body.photo === null

		const { title } = validate(schema(), { ...req.body, photo: uploadedPhoto })

		const photo = uploadedPhoto ? await StorageUseCases.upload('interactions/tags', uploadedPhoto) : undefined

		const updatedTag = await TagsUseCases.update({
			id: req.params.id,
			data: {
				title,
				...(changedPhoto ? { photo } : {}),
			},
		})
		if (updatedTag) return updatedTag
		throw new NotAuthorizedError()
	},
)

router.delete<InteractionsTagsDeleteRouteDef>({ path: '/:id', key: 'interactions-tags-delete', middlewares: [isAuthenticated, isAdmin] })(
	async (req) => {
		const isDeleted = await TagsUseCases.delete({ id: req.params.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	},
)

export default router

type TagsBody = { title: string }

type InteractionsTagsGetRouteDef = ApiDef<{
	key: 'interactions-tags-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<TagEntity>
}>

type InteractionsTagsFindRouteDef = ApiDef<{
	key: 'interactions-tags-find'
	method: 'get'
	params: { id: string }
	response: TagEntity
}>

type InteractionsTagsCreateRouteDef = ApiDef<{
	key: 'interactions-tags-create'
	method: 'post'
	body: TagsBody & { type: TagTypes; photo: FileSchema | null }
	response: TagEntity
}>

type InteractionsTagsUpdateRouteDef = ApiDef<{
	key: 'interactions-tags-update'
	method: 'put'
	params: { id: string }
	body: TagsBody & { photo?: FileSchema | null }
	response: TagEntity
}>

type InteractionsTagsDeleteRouteDef = ApiDef<{
	key: 'interactions-tags-delete'
	method: 'delete'
	params: { id: string }
	response: boolean
}>
