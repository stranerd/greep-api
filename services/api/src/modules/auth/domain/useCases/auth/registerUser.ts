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
			...params,
			isVerified: false,
			authTypes: [AuthTypes.email]
		}

		return await this.repository.addNewUser(userModel, AuthTypes.email)
	}
}