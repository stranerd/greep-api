import { ITokenRepository } from '../irepositories/tokens'
import { BaseUseCase } from '@stranerd/api-commons'

export class DeleteUserTokensUseCase extends BaseUseCase<string, boolean> {
	private repository: ITokenRepository

	constructor (repository: ITokenRepository) {
		super()
		this.repository = repository
	}

	async execute (userId: string) {
		return await this.repository.delete(userId)
	}
}
