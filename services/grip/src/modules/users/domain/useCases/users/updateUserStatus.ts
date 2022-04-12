import { BaseUseCase } from '@stranerd/api-commons'
import { IUserRepository } from '../../i-repositories/users'

type Input = { userId: string, socketId: string, add: boolean }

export class UpdateUserStatusUseCase implements BaseUseCase<Input, boolean> {
	repository: IUserRepository

	constructor (repo: IUserRepository) {
		this.repository = repo
	}

	async execute (input: Input) {
		return await this.repository.updateUserStatus(input.userId, input.socketId, input.add)
	}
}