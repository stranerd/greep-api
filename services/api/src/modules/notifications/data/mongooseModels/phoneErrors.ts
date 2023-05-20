import { appInstance } from '@utils/environment'
import { PhoneErrorDbChangeCallbacks } from '../../utils/changes/phoneErrors'
import { PhoneErrorMapper } from '../mappers/phoneErrors'
import { PhoneErrorFromModel } from '../models/phoneErrors'

const Schema = new appInstance.dbs.mongo.Schema<PhoneErrorFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	error: {
		type: String,
		required: true
	},
	from: {
		type: String,
		required: true
	},
	to: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	createdAt: {
		type: Number,
		required: false,
		default: Date.now
	},
	updatedAt: {
		type: Number,
		required: false,
		default: Date.now
	}
}, { timestamps: { currentTime: Date.now } })

export const PhoneError = appInstance.dbs.mongo.use().model<PhoneErrorFromModel>('NotificationsPhoneError', Schema)

export const PhoneErrorChange = appInstance.dbs.mongo.change(PhoneError, PhoneErrorDbChangeCallbacks, new PhoneErrorMapper().mapFrom)