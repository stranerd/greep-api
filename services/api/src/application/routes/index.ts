import { authRoutes } from './auth'
import { categoriesRoutes } from './categories'
import { messagingRoutes } from './messaging'
import { notificationRoutes } from './notifications'
import { paymentRoutes } from './payment'
import { tripRoutes } from './trips'
import { userRoutes } from './users'

export const routes = [
	...authRoutes,
	...messagingRoutes,
	...notificationRoutes,
	...paymentRoutes,
	...tripRoutes,
	...userRoutes,
	...categoriesRoutes,
]
