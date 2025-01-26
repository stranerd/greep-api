import { isAuthenticated } from '@application/middlewares'
import { EntitySchema, InteractionEntity, LikeEntity, LikesUseCases, verifyInteraction } from '@modules/interactions'
import { UsersUseCases } from '@modules/users'
import { ApiDef, BadRequestError, NotFoundError, QueryKeys, QueryParams, QueryResults, Router, Schema, validate } from 'equipped'

const router = new Router({ path: '/likes', groups: ['Likes'], middlewares: [isAuthenticated] })

router.get<InteractionsLikesGetRouteDef>({ path: '/', key: 'interactions-likes-get' })(async (req) => {
	const query = req.query
	const userId = req.authUser!.id
	query.authType = QueryKeys.or
	query.auth = [
		{ field: 'entity.userId', value: userId },
		{ field: 'user.id', value: userId },
	]
	return await LikesUseCases.get(query)
})

router.get<InteractionsLikesFindRouteDef>({ path: '/:id', key: 'interactions-likes-find' })(async (req) => {
	const like = await LikesUseCases.find(req.params.id)
	const userId = req.authUser!.id
	if (!like) throw new NotFoundError()
	if (like.user.id !== userId && like.entity.userId !== userId) throw new NotFoundError()
	return like
})

router.post<InteractionsLikesCreateRouteDef>({ path: '/', key: 'interactions-likes-create' })(async (req) => {
	const { action, ...data } = validate(
		{
			value: Schema.boolean(),
			entity: EntitySchema(),
			action: Schema.in(['likes' as const, 'dislikes' as const]).default('likes'),
		},
		req.body,
	)

	const entity = await verifyInteraction(data.entity, action)
	const user = await UsersUseCases.find(req.authUser!.id)
	if (!user || user.isDeleted()) throw new BadRequestError('profile not found')

	return await LikesUseCases.like({
		...data,
		entity,
		user: user.getEmbedded(),
	})
})

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
	body: { value: boolean; entity: Omit<InteractionEntity, 'userId'>; action: 'likes' | 'dislikes' }
	response: LikeEntity | null
}>
