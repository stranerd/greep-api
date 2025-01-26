import { isAdmin, isAuthenticated } from '@application/middlewares'
import { EntitySchema, InteractionEntity, ReportEntity, ReportsUseCases, verifyInteraction } from '@modules/interactions'
import { UsersUseCases } from '@modules/users'
import { ApiDef, AuthRole, BadRequestError, NotFoundError, QueryKeys, QueryParams, QueryResults, Router, Schema, validate } from 'equipped'

const router = new Router({ path: '/reports', groups: ['Reports'], middlewares: [isAuthenticated] })

router.get<InteractionsReportsGetRouteDef>({ path: '/', key: 'interactions-reports-get', middlewares: [isAdmin] })(async (req) => {
	const query = req.query
	const userId = req.authUser!.id
	const isAdmin = req.authUser!.roles[AuthRole.isAdmin]
	if (!isAdmin) {
		query.authType = QueryKeys.or
		query.auth = [
			{ field: 'entity.userId', value: userId },
			{ field: 'user.id', value: userId },
		]
	}
	return await ReportsUseCases.get(query)
})

router.get<InteractionsReportsFindRouteDef>({ path: '/:id', key: 'interactions-reports-find', middlewares: [isAdmin] })(async (req) => {
	const report = await ReportsUseCases.find(req.params.id)
	const userId = req.authUser!.id
	const isAdmin = req.authUser!.roles[AuthRole.isAdmin]
	if (!report) throw new NotFoundError()
	if (!isAdmin && report.user.id !== userId && report.entity.userId !== userId) throw new NotFoundError()
	return report
})

router.delete<InteractionsReportsDeleteRouteDef>({ path: '/:id', key: 'interactions-reports-delete', middlewares: [isAdmin] })(
	async (req) => await ReportsUseCases.delete(req.params.id),
)

router.post<InteractionsReportsCreateRouteDef>({ path: '/', key: 'interactions-reports-create' })(async (req) => {
	const data = validate(
		{
			message: Schema.string().min(1),
			entity: EntitySchema(),
		},
		req.body,
	)

	const entity = await verifyInteraction(data.entity, 'reports')
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
	body: { message: string; entity: Omit<InteractionEntity, 'userId'> }
	response: ReportEntity
}>
