import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'
import { PasswordsController } from '../../controllers/auth/passwords'

export default groupRoutes({ path: '/passwords', tags: ['Passwords'] }, [
	{
		path: '/reset/mail',
		method: 'post',
		handler: PasswordsController.sendResetMail,
	},
	{
		path: '/reset',
		method: 'post',
		handler: PasswordsController.resetPassword,
	},
	{
		path: '/update',
		method: 'post',
		handler: PasswordsController.updatePassword,
		middlewares: [isAuthenticated],
	},
])
