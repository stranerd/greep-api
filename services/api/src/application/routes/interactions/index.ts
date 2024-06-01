import { groupRoutes } from 'equipped'
import { commentsRoutes } from './comments'
import { likesRoutes } from './likes'
import { mediaRoutes } from './media'
import { reportsRoutes } from './reports'
import { reviewsRoutes } from './reviews'
import { tagsRoutes } from './tags'
import { viewsRoutes } from './views'

export const interactionRoutes = groupRoutes({ path: '/interactions', groups: ['Interactions'] }, [
	...commentsRoutes,
	...likesRoutes,
	...mediaRoutes,
	...reportsRoutes,
	...reviewsRoutes,
	...tagsRoutes,
	...viewsRoutes,
])
