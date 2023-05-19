import { EmailErrorToModel } from '../../data/models/emailErrors'
import { EmailErrorEntity } from '../entities/emailErrors'

export interface IEmailErrorRepository {
	add: (data: EmailErrorToModel) => Promise<EmailErrorEntity>
	getAndDeleteAll: () => Promise<EmailErrorEntity[]>
}
