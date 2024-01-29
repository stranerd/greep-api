import { IPhoneErrorRepository } from '../../domain/irepositories/phoneErrors'
import { PhoneErrorMapper } from '../mappers/phoneErrors'
import { PhoneErrorToModel } from '../models/phoneErrors'
import { PhoneError } from '../mongooseModels/phoneErrors'

export class PhoneErrorRepository implements IPhoneErrorRepository {
	private static instance: PhoneErrorRepository
	private mapper: PhoneErrorMapper

	private constructor() {
		this.mapper = new PhoneErrorMapper()
	}

	static getInstance() {
		if (!PhoneErrorRepository.instance) PhoneErrorRepository.instance = new PhoneErrorRepository()
		return PhoneErrorRepository.instance
	}

	async add(data: PhoneErrorToModel) {
		const error = await new PhoneError(data).save()
		return this.mapper.mapFrom(error)!
	}

	async getAndDeleteAll() {
		const errors = await PhoneError.find()
		await PhoneError.deleteMany()
		return errors.map((error) => this.mapper.mapFrom(error)!)
	}
}
