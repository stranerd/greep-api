import { isAuthenticatedButIgnoreVerified } from '@application/middlewares'
import { makeController, Route } from 'equipped'
import { EmailsController } from '../../controllers/auth/emails'

const emailSignIn: Route = {
	path: '/auth/emails/signin',
	method: 'post',
	controllers: [makeController(async (req) => EmailsController.signin(req))],
}

const emailSignUp: Route = {
	path: '/auth/emails/signup',
	method: 'post',
	controllers: [makeController(async (req) => EmailsController.signup(req))],
}

const sendVerificationEmail: Route = {
	path: '/auth/emails/verify/mail',
	method: 'post',
	controllers: [isAuthenticatedButIgnoreVerified, makeController(async (req) => EmailsController.sendVerificationMail(req))],
}

const verifyEmail: Route = {
	path: '/auth/emails/verify',
	method: 'post',
	controllers: [makeController(async (req) => EmailsController.verifyEmail(req))],
}

const routes: Route[] = [emailSignIn, emailSignUp, sendVerificationEmail, verifyEmail]
export default routes
