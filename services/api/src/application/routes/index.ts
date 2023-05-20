import { Route } from 'equipped'
import { authRoutes } from './auth'
import { notificationRoutes } from './notifications'
import { paymentRoutes } from './payment'
import { tripRoutes } from './trips'
import { userRoutes } from './users'

export const routes: Route[] = [
	...authRoutes,
	...notificationRoutes,
	...paymentRoutes,
	...tripRoutes,
	...userRoutes
]