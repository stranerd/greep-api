import emailRoutes from './emails'
import identityRoutes from './identities'
import passwordRoutes from './passwords'
import tokenRoutes from './token'
import userRoutes from './user'

export const authRoutes = [
	...emailRoutes,
	...passwordRoutes,
	...userRoutes,
	...tokenRoutes,
	...identityRoutes
]