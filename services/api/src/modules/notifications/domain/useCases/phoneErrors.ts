import { IPhoneErrorRepository } from '../irepositories/phoneErrors'
import { PhoneErrorToModel } from '../../data/models/phoneErrors'

export class PhoneErrorsUseCase {
	private repository: IPhoneErrorRepository

	constructor (repository: IPhoneErrorRepository) {
		this.repository = repository
	}

	async add (data: PhoneErrorToModel) {
		return await this.repository.add(data)
	}

	async getAndDeleteAll () {
		return await this.repository.getAndDeleteAll()
	}
}
