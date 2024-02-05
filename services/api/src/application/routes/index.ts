import { authRoutes } from './auth'
import { cartRoutes } from './cart'
import { categoriesRoutes } from './categories'
import { messagingRoutes } from './messaging'
import { notificationRoutes } from './notifications'
import { paymentRoutes } from './payment'
import { productRoutes } from './products'
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
	...productRoutes,
	...cartRoutes
]
