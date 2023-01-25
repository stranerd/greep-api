import { Route } from '@stranerd/api-commons'
import authRoutes from './auth'
import usersRoutes from './users'

export const routes: Route[] = [
	...authRoutes,
	...usersRoutes
]