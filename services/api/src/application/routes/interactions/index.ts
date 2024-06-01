import { Router } from 'equipped'
import { commentsRoutes } from './comments'
import { likesRoutes } from './likes'
import { mediaRoutes } from './media'
import { reportsRoutes } from './reports'
import { reviewsRoutes } from './reviews'
import { tagsRoutes } from './tags'
import { viewsRoutes } from './views'

const router = new Router({ path: '/interactions', groups: ['Interactions'] })
router.add(...commentsRoutes, ...likesRoutes, ...mediaRoutes, ...reportsRoutes, ...reviewsRoutes, ...tagsRoutes, ...viewsRoutes)

export default router
