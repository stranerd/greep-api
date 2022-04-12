import { AuthTypes, BaseUseCase } from '@stranerd/api-commons'
import { RegisterInput } from '../../types'
import { IAuthRepository } from '../../i-repositories/auth'
import { UserToModel } from '../../../data/models/users'
import { UserEntity } from '../../entities/users'

export class RegisterUserUseCase implements BaseUseCase<RegisterInput, UserEntity> {
	repository: IAuthRepository

	constructor (repo: IAuthRepository) {
		this.repository = repo
	}

	async execute (params: RegisterInput) {
		const userModel: UserToModel = {
			firstName: params.firstName,
			lastName: params.lastName,
			password: params.password,
			email: params.email,
			description: params.description,
			photo: params.photo,
			coverPhoto: params.coverPhoto,
			referrer: params.referrer,
			isVerified: false,
			authTypes: [AuthTypes.email]
		}

		return await this.repository.addNewUser(userModel, AuthTypes.email)
	}
}