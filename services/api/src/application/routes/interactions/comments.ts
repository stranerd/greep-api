import { isAuthenticated } from '@application/middlewares'
import { CommentEntity, CommentsUseCases, InteractionEntities, verifyInteraction } from '@modules/interactions'
import { UsersUseCases } from '@modules/users'
import { ApiDef, BadRequestError, NotAuthorizedError, NotFoundError, QueryParams, QueryResults, Router, Schema, validate } from 'equipped'

const schema = () => ({
	body: Schema.string().min(1),
})

const router = new Router({ path: '/comments', groups: ['Comments'] })

router.get<InteractionsCommentsGetRouteDef>({ path: '/', key: 'interactions-comments-get' })(async (req) => {
	const query = req.query
	return await CommentsUseCases.get(query)
})

router.get<InteractionsCommentsFindRouteDef>({ path: '/:id', key: 'interactions-comments-find' })(async (req) => {
	const comment = await CommentsUseCases.find(req.params.id)
	if (!comment) throw new NotFoundError()
	return comment
})

router.post<InteractionsCommentsCreateRouteDef>({ path: '/', key: 'interactions-comments-create', middlewares: [isAuthenticated] })(
	async (req) => {
		const data = validate(
			{
				...schema(),
				entity: Schema.object({
					id: Schema.string().min(1),
					type: Schema.in(Object.values(InteractionEntities)),
				}),
			},
			req.body,
		)

		const entity = await verifyInteraction(data.entity.type, data.entity.id, 'comments')
		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('profile not found')

		return await CommentsUseCases.create({
			...data,
			entity,
			user: user.getEmbedded(),
		})
	},
)

router.put<InteractionsCommentsUpdateRouteDef>({ path: '/:id', key: 'interactions-comments-update', middlewares: [isAuthenticated] })(
	async (req) => {
		const data = validate(schema(), req.body)

		const updated = await CommentsUseCases.update({
			id: req.params.id,
			userId: req.authUser!.id,
			data,
		})
		if (updated) return updated
		throw new NotAuthorizedError()
	},
)

router.delete<InteractionsCommentsDeleteRouteDef>({ path: '/:id', key: 'interactions-comments-delete', middlewares: [isAuthenticated] })(
	async (req) => {
		const isDeleted = await CommentsUseCases.delete({
			id: req.params.id,
			userId: req.authUser!.id,
		})
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	},
)

export default router

type CommentBody = { body: string }

type InteractionsCommentsGetRouteDef = ApiDef<{
	key: 'interactions-comments-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<CommentEntity>
}>

type InteractionsCommentsFindRouteDef = ApiDef<{
	key: 'interactions-comments-find'
	method: 'get'
	params: { id: string }
	response: CommentEntity
}>

type InteractionsCommentsCreateRouteDef = ApiDef<{
	key: 'interactions-comments-create'
	method: 'post'
	body: CommentBody & { entity: { id: string; type: InteractionEntities } }
	response: CommentEntity
}>

type InteractionsCommentsUpdateRouteDef = ApiDef<{
	key: 'interactions-comments-update'
	method: 'put'
	params: { id: string }
	body: CommentBody
	response: CommentEntity
}>

type InteractionsCommentsDeleteRouteDef = ApiDef<{
	key: 'interactions-comments-delete'
	method: 'delete'
	params: { id: string }
	response: boolean
}>
