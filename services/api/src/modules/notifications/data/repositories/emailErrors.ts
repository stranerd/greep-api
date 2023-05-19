import { IEmailErrorRepository } from '../../domain/irepositories/emailErrors'
import { EmailErrorMapper } from '../mappers/emailErrors'
import { EmailErrorToModel } from '../models/emailErrors'
import { EmailError } from '../mongooseModels/emailErrors'

export class EmailErrorRepository implements IEmailErrorRepository {
	private static instance: EmailErrorRepository
	private mapper: EmailErrorMapper

	private constructor () {
		this.mapper = new EmailErrorMapper()
	}

	static getInstance () {
		if (!EmailErrorRepository.instance) EmailErrorRepository.instance = new EmailErrorRepository()
		return EmailErrorRepository.instance
	}

	async add (data: EmailErrorToModel) {
		const error = await new EmailError(data).save()
		return this.mapper.mapFrom(error)!
	}

	async getAndDeleteAll () {
		const errors = await EmailError.find()
		await EmailError.deleteMany()
		return errors.map((error) => this.mapper.mapFrom(error)!)
	}
}