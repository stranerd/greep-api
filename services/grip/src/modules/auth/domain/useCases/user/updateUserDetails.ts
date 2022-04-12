import { BaseUseCase } from '@stranerd/api-commons'
import { RegisterInput } from '../../types'
import { IUserRepository } from '../../i-repositories/users'
import { UserEntity } from '../../entities/users'

type Input = {
	userId: string,
	data: RegisterInput
}

export class UpdateUserDetailsUseCase implements BaseUseCase<Input, UserEntity> {
	repository: IUserRepository

	constructor (repo: IUserRepository) {
		this.repository = repo
	}

	async execute (input: Input) {
		return await this.repository.updateDetails(input.userId, input.data)
	}
}