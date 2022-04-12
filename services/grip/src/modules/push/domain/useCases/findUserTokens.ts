import { ITokenRepository } from '../irepositories/tokens'
import { TokenToModel } from '../../data/models/tokens'
import { BaseUseCase } from '@stranerd/api-commons'
import { TokenEntity } from '../entities/tokens'

type Input = { userId: string }

export class FindUserTokensUseCase extends BaseUseCase<TokenToModel, TokenEntity> {
	private repository: ITokenRepository

	constructor (repository: ITokenRepository) {
		super()
		this.repository = repository
	}

	async execute (data: Input) {
		return await this.repository.find(data.userId)
	}
}
