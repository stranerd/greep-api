import { Route } from 'equipped'
import { authRoutes } from './auth'
import { messagingRoutes } from './messaging'
import { notificationRoutes } from './notifications'
import { paymentRoutes } from './payment'
import { tripRoutes } from './trips'
import { userRoutes } from './users'

export const routes: Route[] = [
	...authRoutes,
	...messagingRoutes,
	...notificationRoutes,
	...paymentRoutes,
	...tripRoutes,
	...userRoutes
]