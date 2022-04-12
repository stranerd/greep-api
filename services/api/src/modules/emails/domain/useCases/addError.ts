import { IErrorRepository } from '../irepositories/errors'
import { ErrorToModel } from '../../data/models/errors'
import { BaseUseCase } from '@stranerd/api-commons'
import { ErrorEntity } from '../entities/errors'

export class AddErrorUseCase extends BaseUseCase<ErrorToModel, ErrorEntity> {
	private repository: IErrorRepository

	constructor (repository: IErrorRepository) {
		super()
		this.repository = repository
	}

	async execute (data: ErrorToModel) {
		return await this.repository.add(data)
	}
}
