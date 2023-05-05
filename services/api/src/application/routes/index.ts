import { Route } from 'equipped'
import authRoutes from './auth'
import { paymentRoutes } from './payment'
import usersRoutes from './users'

export const routes: Route[] = [
	...authRoutes,
	...paymentRoutes,
	...usersRoutes
]