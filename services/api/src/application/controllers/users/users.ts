import { StorageUseCases } from '@modules/storage'
import { UserType, UsersUseCases } from '@modules/users'
import { NotAuthorizedError, NotFoundError, QueryParams, Request, Schema, validate } from 'equipped'

export class UsersController {
	static async getUsers (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'dates.deletedAt', value: null }]
		return await UsersUseCases.get(query)
	}

	static async getUsersAdmin (req: Request) {
		const query = req.query as QueryParams
		return await UsersUseCases.get(query)
	}

	static async findUser (req: Request) {
		const user = await UsersUseCases.find(req.params.id)
		if (!user || user.isDeleted()) throw new NotFoundError()
		return user
	}

	static async findUserAdmin (req: Request) {
		const user = await UsersUseCases.find(req.params.id)
		if (!user) throw new NotFoundError()
		return user
	}

	static async updateType (req: Request) {
		const { data } = validate({
			data: Schema.or([
				Schema.object({
					type: Schema.is(UserType.driver as const),
					license: Schema.file().image()
				}),
				Schema.object({
					type: Schema.is(UserType.customer as const),
					passport: Schema.file().image(),
					studentId: Schema.file().image(),
				})
			])
		}, {
			data: {
				...req.body,
				license: req.files.license?.at(0) ?? null,
				passport: req.files.passport?.at(0) ?? null,
				studentId: req.files.studentId?.at(0) ?? null,
			}
		})


		if (data.type === UserType.driver) {
			const license = await StorageUseCases.upload('users/drivers/licenses', data.license)
			const updated = await UsersUseCases.updateType({ userId: req.authUser!.id, data: { ...data, license } })
			if (updated) return updated
		} else if (data.type === UserType.customer) {
			const passport = await StorageUseCases.upload('users/students/passport', data.passport)
			const studentId = await StorageUseCases.upload('users/students/studentId', data.studentId)
			const updated = await UsersUseCases.updateType({ userId: req.authUser!.id, data: { ...data, passport, studentId } })
			if (updated) return updated
		}

		throw new NotAuthorizedError('cannot update user type')
	}

	static async updateApplication (req: Request) {
		const data = validate({
			accepted: Schema.boolean(),
			message: Schema.string()
		}, req.body)

		const updated = await UsersUseCases.updateApplication({ userId: req.authUser!.id, data })
		if (updated) return updated
		throw new NotAuthorizedError('cannot update user application')
	}
}