import { groupRoutes } from 'equipped'
import { IdentitiesController } from '../../controllers/auth/identities'

export default groupRoutes({ path: '/identities', tags: ['Identities'] }, [
	{
		path: '/google',
		method: 'post',
		handler: IdentitiesController.googleSignIn,
	},
	{
		path: '/apple',
		method: 'post',
		handler: IdentitiesController.appleSignIn,
	},
])
