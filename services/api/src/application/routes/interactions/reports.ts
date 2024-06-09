import { isAdmin, isAuthenticated } from '@application/middlewares'
import { InteractionEntities, ReportEntity, ReportsUseCases, verifyInteraction } from '@modules/interactions'
import { UsersUseCases } from '@modules/users'
import { ApiDef, BadRequestError, NotFoundError, QueryParams, QueryResults, Router, Schema, validate } from 'equipped'

const router = new Router({ path: '/reports', groups: ['Reports'], middlewares: [isAuthenticated] })

router.get<InteractionsReportsGetRouteDef>({ path: '/', key: 'interactions-reports-get', middlewares: [isAdmin] })(async (req) => {
	const query = req.query
	return await ReportsUseCases.get(query)
})

router.get<InteractionsReportsFindRouteDef>({ path: '/:id', key: 'interactions-reports-find', middlewares: [isAdmin] })(async (req) => {
	const report = await ReportsUseCases.find(req.params.id)
	if (!report) throw new NotFoundError()
	return report
})

router.delete<InteractionsReportsDeleteRouteDef>({ path: '/:id', key: 'interactions-reports-delete', middlewares: [isAdmin] })(
	async (req) => await ReportsUseCases.delete(req.params.id),
)

router.post<InteractionsReportsCreateRouteDef>({ path: '/', key: 'interactions-reports-create' })(async (req) => {
	const data = validate(
		{
			message: Schema.string().min(1),
			entity: Schema.object({
				id: Schema.string().min(1),
				type: Schema.in(Object.values(InteractionEntities)),
			}),
		},
		req.body,
	)

	const entity = await verifyInteraction(data.entity.type, data.entity.id, 'reports')
	const user = await UsersUseCases.find(req.authUser!.id)
	if (!user || user.isDeleted()) throw new BadRequestError('profile not found')

	return await ReportsUseCases.create({
		...data,
		entity,
		user: user.getEmbedded(),
	})
})

export default router

type InteractionsReportsGetRouteDef = ApiDef<{
	key: 'interactions-reports-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<ReportEntity>
}>

type InteractionsReportsFindRouteDef = ApiDef<{
	key: 'interactions-reports-find'
	method: 'get'
	params: { id: string }
	response: ReportEntity
}>

type InteractionsReportsDeleteRouteDef = ApiDef<{
	key: 'interactions-reports-delete'
	method: 'delete'
	params: { id: string }
	response: boolean
}>

type InteractionsReportsCreateRouteDef = ApiDef<{
	key: 'interactions-reports-create'
	method: 'post'
	body: { message: string; entity: { id: string; type: InteractionEntities } }
	response: ReportEntity
}>
