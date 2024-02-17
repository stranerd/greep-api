import { authRoutes } from './auth'
import { interactionRoutes } from './interactions'
import { marketplaceRoutes } from './marketplace'
import { messagingRoutes } from './messaging'
import { notificationRoutes } from './notifications'
import { paymentRoutes } from './payment'
import { tripRoutes } from './trips'
import { userRoutes } from './users'

export const routes = [
	...authRoutes,
	...interactionRoutes,
	...marketplaceRoutes,
	...messagingRoutes,
	...notificationRoutes,
	...paymentRoutes,
	...tripRoutes,
	...userRoutes,
]
