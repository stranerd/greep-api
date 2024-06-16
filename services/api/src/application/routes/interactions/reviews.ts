import { isAuthenticated } from '@application/middlewares'
import { EntitySchema, InteractionEntity, ReviewEntity, ReviewsUseCases, verifyInteraction } from '@modules/interactions'
import { UsersUseCases } from '@modules/users'
import { ApiDef, BadRequestError, NotFoundError, QueryParams, QueryResults, Router, Schema, validate } from 'equipped'

const router = new Router({ path: '/reviews', groups: ['Reviews'] })

router.get<InteractionsReviewsGetRouteDef>({ path: '/', key: 'interactions-reviews-get' })(async (req) => {
	const query = req.query
	return await ReviewsUseCases.get(query)
})

router.get<InteractionsReviewsFindRouteDef>({ path: '/:id', key: 'interactions-reviews-find' })(async (req) => {
	const review = await ReviewsUseCases.find(req.params.id)
	if (!review) throw new NotFoundError()
	return review
})

router.post<InteractionsReviewsCreateRouteDef>({ path: '/', key: 'interactions-reviews-create', middlewares: [isAuthenticated] })(
	async (req) => {
		const data = validate(
			{
				rating: Schema.number().round(0).gte(0).lte(5),
				message: Schema.string(),
				entity: EntitySchema(),
			},
			req.body,
		)

		const entity = await verifyInteraction(data.entity, 'reviews')
		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('profile not found')

		return await ReviewsUseCases.add({
			...data,
			entity,
			user: user.getEmbedded(),
		})
	},
)

export default router

type InteractionsReviewsGetRouteDef = ApiDef<{
	key: 'interactions-reviews-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<ReviewEntity>
}>

type InteractionsReviewsFindRouteDef = ApiDef<{
	key: 'interactions-reviews-find'
	method: 'get'
	params: { id: string }
	response: ReviewEntity
}>

type InteractionsReviewsCreateRouteDef = ApiDef<{
	key: 'interactions-reviews-create'
	method: 'post'
	body: { rating: number; message: string; entity: Omit<InteractionEntity, 'userId'> }
	response: ReviewEntity
}>
