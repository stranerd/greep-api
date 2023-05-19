import { IEmailErrorRepository } from '../irepositories/emailErrors'
import { EmailErrorToModel } from '../../data/models/emailErrors'

export class EmailErrorsUseCase {
	private repository: IEmailErrorRepository

	constructor (repository: IEmailErrorRepository) {
		this.repository = repository
	}

	async add (data: EmailErrorToModel) {
		return await this.repository.add(data)
	}

	async getAndDeleteAll () {
		return await this.repository.getAndDeleteAll()
	}
}
