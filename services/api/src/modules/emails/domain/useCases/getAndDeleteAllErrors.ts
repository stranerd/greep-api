import { IErrorRepository } from '../irepositories/errors'
import { BaseUseCase } from '@stranerd/api-commons'
import { ErrorEntity } from '../entities/errors'

export class GetAndDeleteAllErrorsUseCase extends BaseUseCase<void, ErrorEntity[]> {
	private repository: IErrorRepository

	constructor (repository: IErrorRepository) {
		super()
		this.repository = repository
	}

	async execute () {
		return await this.repository.getAndDeleteAll()
	}
}
