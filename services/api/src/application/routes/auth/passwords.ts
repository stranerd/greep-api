import { isAuthenticated } from '@application/middlewares'
import { makeController, Route } from 'equipped'
import { PasswordsController } from '../../controllers/auth/passwords'

const resetPasswordEmail: Route = {
	path: '/auth/passwords/reset/mail',
	method: 'post',
	controllers: [makeController(async (req) => PasswordsController.sendResetMail(req))],
}

const resetPassword: Route = {
	path: '/auth/passwords/reset',
	method: 'post',
	controllers: [makeController(async (req) => PasswordsController.resetPassword(req))],
}

const updatePassword: Route = {
	path: '/auth/passwords/update',
	method: 'post',
	controllers: [isAuthenticated, makeController(async (req) => PasswordsController.updatePassword(req))],
}

const routes: Route[] = [resetPasswordEmail, resetPassword, updatePassword]
export default routes
