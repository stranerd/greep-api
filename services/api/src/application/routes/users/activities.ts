import { isAuthenticated } from '@application/middlewares'
import { ActivitiesUseCases, ActivityEntity } from '@modules/users'
import { ApiDef, NotFoundError, QueryParams, QueryResults, Router } from 'equipped'

const router = new Router({ path: '/activities', groups: ['Activities'], middlewares: [isAuthenticated] })

router.get<ActivitiesGetRouteDef>({ path: '/', key: 'users-activities-get' })(async (req) => {
	const query = req.query
	query.auth = [{ field: 'userId', value: req.authUser!.id }]
	return await ActivitiesUseCases.get(query)
})

router.get<ActivitiesFindRouteDef>({ path: '/:id', key: 'users-activities-find' })(async (req) => {
	const activity = await ActivitiesUseCases.find(req.params.id)
	if (!activity || activity.userId !== req.authUser!.id) throw new NotFoundError()
	return activity
})

export default router

type ActivitiesGetRouteDef = ApiDef<{
	key: 'users-activities-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<ActivityEntity>
}>

type ActivitiesFindRouteDef = ApiDef<{
	key: 'users-activities-find'
	method: 'get'
	params: { id: string }
	response: ActivityEntity
}>
