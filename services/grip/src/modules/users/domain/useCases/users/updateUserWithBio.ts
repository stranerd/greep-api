import { BaseUseCase } from '@stranerd/api-commons'
import { IUserRepository } from '../../i-repositories/users'
import { UserBio } from '../../types'

type Input = { id: string, data: UserBio, timestamp: number }

export class UpdateUserWithBioUseCase implements BaseUseCase<Input, void> {
	repository: IUserRepository

	constructor (repo: IUserRepository) {
		this.repository = repo
	}

	async execute (params: Input) {
		return await this.repository.updateUserWithBio(params.id, params.data, params.timestamp)
	}
}