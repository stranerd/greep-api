import { groupRoutes } from 'equipped'
import emailRoutes from './emails'
import identityRoutes from './identities'
import passwordRoutes from './passwords'
import tokenRoutes from './token'
import userRoutes from './user'

export const authRoutes = groupRoutes({ path: '/auth', tags: ['Auth'] }, [
	...emailRoutes,
	...passwordRoutes,
	...userRoutes,
	...tokenRoutes,
	...identityRoutes,
])
