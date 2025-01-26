import { PhoneErrorToModel } from '../../data/models/phoneErrors'
import { PhoneErrorEntity } from '../entities/phoneErrors'

export interface IPhoneErrorRepository {
	add: (data: PhoneErrorToModel) => Promise<PhoneErrorEntity>
	getAndDeleteAll: () => Promise<PhoneErrorEntity[]>
}
