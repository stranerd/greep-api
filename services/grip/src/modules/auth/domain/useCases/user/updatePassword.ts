import { BaseUseCase } from '@stranerd/api-commons'
import { IUserRepository } from '../../i-repositories/users'

type Input = {
	userId: string,
	password: string
}

export class UpdatePasswordUseCase implements BaseUseCase<Input, boolean> {
	repository: IUserRepository

	constructor (repo: IUserRepository) {
		this.repository = repo
	}

	async execute (input: Input) {
		return await this.repository.updatePassword(input.userId, input.password)
	}
}