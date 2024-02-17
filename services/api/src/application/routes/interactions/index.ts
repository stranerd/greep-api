import { groupRoutes } from 'equipped'
import { commentsRoutes } from './comments'
import { likesRoutes } from './likes'
import { reportsRoutes } from './reports'
import { reviewsRoutes } from './reviews'
import { tagsRoutes } from './tags'
import { viewsRoutes } from './views'

export const interactionRoutes = groupRoutes('/interactions', [
	...commentsRoutes,
	...likesRoutes,
	...reportsRoutes,
	...reviewsRoutes,
	...tagsRoutes,
	...viewsRoutes,
])
