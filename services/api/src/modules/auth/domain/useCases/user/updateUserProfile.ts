import { BaseUseCase } from '@stranerd/api-commons'
import { UserUpdateInput } from '../../types'
import { IUserRepository } from '../../i-repositories/users'
import { UserEntity } from '../../entities/users'

type Input = {
	userId: string,
	data: UserUpdateInput
}

export class UpdateUserProfileUseCase implements BaseUseCase<Input, UserEntity> {
	repository: IUserRepository

	constructor (repo: IUserRepository) {
		this.repository = repo
	}

	async execute (input: Input) {
		return await this.repository.updateUserProfile(input.userId, input.data)
	}
}