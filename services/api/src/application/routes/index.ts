import { Route } from 'equipped'
import authRoutes from './auth'
import usersRoutes from './users'

export const routes: Route[] = [
	...authRoutes,
	...usersRoutes
]