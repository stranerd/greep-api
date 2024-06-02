import { isAuthenticated } from '@application/middlewares'
import { InteractionEntities, LikeEntity, LikesUseCases, verifyInteractionAndGetUserId } from '@modules/interactions'
import { UsersUseCases } from '@modules/users'
import { ApiDef, BadRequestError, NotFoundError, QueryParams, QueryResults, Router, Schema, validate } from 'equipped'

const router = new Router({ path: '/likes', groups: ['Likes'] })

router.get<InteractionsLikesGetRouteDef>({ path: '/', key: 'interactions-likes-get' })(async (req) => {
	const query = req.query
	return await LikesUseCases.get(query)
})

router.get<InteractionsLikesFindRouteDef>({ path: '/:id', key: 'interactions-likes-find' })(async (req) => {
	const like = await LikesUseCases.find(req.params.id)
	if (!like) throw new NotFoundError()
	return like
})

router.post<InteractionsLikesCreateRouteDef>({ path: '/', key: 'interactions-likes-create', middlewares: [isAuthenticated] })(
	async (req) => {
		const { entity, value } = validate(
			{
				value: Schema.boolean(),
				entity: Schema.object({
					id: Schema.string().min(1),
					type: Schema.in(Object.values(InteractionEntities)),
				}),
			},
			req.body,
		)

		const userId = await verifyInteractionAndGetUserId(entity.type, entity.id, value ? 'likes' : 'dislikes')
		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('profile not found')

		return await LikesUseCases.like({
			value,
			entity: { ...entity, userId },
			user: user.getEmbedded(),
		})
	},
)

export default router

type InteractionsLikesGetRouteDef = ApiDef<{
	key: 'interactions-likes-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<LikeEntity>
}>

type InteractionsLikesFindRouteDef = ApiDef<{
	key: 'interactions-likes-find'
	method: 'get'
	params: { id: string }
	response: LikeEntity
}>

type InteractionsLikesCreateRouteDef = ApiDef<{
	key: 'interactions-likes-create'
	method: 'post'
	body: { value: boolean; entity: { id: string; type: InteractionEntities } }
	response: LikeEntity
}>
