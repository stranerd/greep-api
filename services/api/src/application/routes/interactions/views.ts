import { isAuthenticated } from '@application/middlewares'
import { InteractionEntities, ViewEntity, ViewsUseCases, verifyInteractionAndGetUserId } from '@modules/interactions'
import { UsersUseCases } from '@modules/users'
import { ApiDef, BadRequestError, NotFoundError, QueryParams, QueryResults, Router, Schema, validate } from 'equipped'

const router = new Router({ path: '/views', groups: ['Views'] })

router.get<InteractionsViewsGetRouteDef>({ path: '/', key: 'interactions-views-get' })(async (req) => {
	const query = req.query
	return await ViewsUseCases.get(query)
})

router.get<InteractionsViewsFindRouteDef>({ path: '/:id', key: 'interactions-views-find' })(async (req) => {
	const view = await ViewsUseCases.find(req.params.id)
	if (!view) throw new NotFoundError()
	return view
})

router.post<InteractionsViewsCreateRouteDef>({ path: '/', key: 'interactions-views-create', middlewares: [isAuthenticated] })(
	async (req) => {
		const { entity } = validate(
			{
				entity: Schema.object({
					id: Schema.string().min(1),
					type: Schema.in(Object.values(InteractionEntities)),
				}),
			},
			req.body,
		)

		const userId = await verifyInteractionAndGetUserId(entity.type, entity.id, 'views')
		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('profile not found')

		return await ViewsUseCases.create({
			entity: { ...entity, userId },
			user: user.getEmbedded(),
		})
	},
)

export default router

type InteractionsViewsGetRouteDef = ApiDef<{
	key: 'interactions-views-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<ViewEntity>
}>

type InteractionsViewsFindRouteDef = ApiDef<{
	key: 'interactions-views-find'
	method: 'get'
	params: { id: string }
	response: ViewEntity
}>

type InteractionsViewsCreateRouteDef = ApiDef<{
	key: 'interactions-views-create'
	method: 'post'
	request: { entity: { id: string; type: InteractionEntities } }
	response: ViewEntity
}>
