import { authRoutes } from './auth'
import { marketplaceRoutes } from './marketplace'
import { messagingRoutes } from './messaging'
import { notificationRoutes } from './notifications'
import { paymentRoutes } from './payment'
import { tripRoutes } from './trips'
import { userRoutes } from './users'

export const routes = [
	...authRoutes,
	...marketplaceRoutes,
	...messagingRoutes,
	...notificationRoutes,
	...paymentRoutes,
	...tripRoutes,
	...userRoutes,
]
