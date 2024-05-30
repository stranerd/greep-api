import { isAuthenticatedButIgnoreVerified } from '@application/middlewares'
import { groupRoutes } from 'equipped'
import { EmailsController } from '../../controllers/auth/emails'

export default groupRoutes({ path: '/emails', tags: ['Emails'] }, [
	{
		path: '/signin',
		method: 'post',
		handler: EmailsController.signin,
	},
	{
		path: '/signup',
		method: 'post',
		handler: EmailsController.signup,
	},
	{
		path: '/verify/mail',
		method: 'post',
		handler: EmailsController.sendVerificationMail,
		middlewares: [isAuthenticatedButIgnoreVerified],
	},
	{
		path: '/verify',
		method: 'post',
		handler: EmailsController.verifyEmail,
	},
])
