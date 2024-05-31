import { Router } from 'equipped'
import auth from './auth'
import { interactionRoutes } from './interactions'
import { marketplaceRoutes } from './marketplace'
import { messagingRoutes } from './messaging'
import { notificationRoutes } from './notifications'
import { paymentRoutes } from './payment'
import { tripRoutes } from './trips'
import { userRoutes } from './users'

export const router = new Router()
router.nest(auth)
router.add(
	...interactionRoutes,
	...marketplaceRoutes,
	...messagingRoutes,
	...notificationRoutes,
	...paymentRoutes,
	...tripRoutes,
	...userRoutes,
)
