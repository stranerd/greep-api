import { BaseUseCase } from '@stranerd/api-commons'
import { IUserRepository } from '../../i-repositories/users'

type Input = { id: string, timestamp: number }

export class MarkUserAsDeletedUseCase implements BaseUseCase<Input, void> {
	repository: IUserRepository

	constructor (repo: IUserRepository) {
		this.repository = repo
	}

	async execute (params: Input) {
		return await this.repository.markUserAsDeleted(params.id, params.timestamp)
	}
}