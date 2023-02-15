import { makeController, Route, StatusCodes } from 'equipped'
import { UserController } from '../../controllers/auth/user'
import { isAdmin, isAuthenticated, isAuthenticatedButIgnoreVerified } from '../../middlewares'

const getUserDetails: Route = {
	path: '/auth/user',
	method: 'get',
	controllers: [
		isAuthenticatedButIgnoreVerified,
		makeController(async (req) => {
			return {
				status: StatusCodes.Ok,
				result: await UserController.findUser(req)
			}
		})
	]
}

const updateUser: Route = {
	path: '/auth/user',
	method: 'put',
	controllers: [
		isAuthenticated,
		makeController(async (req) => {
			return {
				status: StatusCodes.Ok,
				result: await UserController.updateUser(req)
			}
		})
	]
}

const updateUserRole: Route = {
	path: '/auth/user/roles',
	method: 'post',
	controllers: [
		isAuthenticated, isAdmin,
		makeController(async (req) => {
			return {
				status: StatusCodes.Ok,
				result: await UserController.updateUserRole(req)
			}
		})
	]
}

const signout: Route = {
	path: '/auth/user/signout',
	method: 'post',
	controllers: [
		makeController(async (req) => {
			return {
				status: StatusCodes.Ok,
				result: await UserController.signout(req)
			}
		})
	]
}

const superAdmin: Route = {
	path: '/auth/user/superAdmin',
	method: 'get',
	controllers: [
		makeController(async (req) => {
			return {
				status: StatusCodes.Ok,
				result: await UserController.superAdmin(req)
			}
		})
	]
}

const deleteAccount: Route = {
	path: '/auth/user',
	method: 'delete',
	controllers: [
		isAuthenticated,
		makeController(async (req) => {
			return {
				status: StatusCodes.Ok,
				result: await UserController.delete(req)
			}
		})
	]
}

const routes: Route[] = [getUserDetails, updateUserRole, updateUser, signout, superAdmin, deleteAccount]
export default routes