import { appInstance } from '@utils/environment'
import { EmailErrorDbChangeCallbacks } from '../../utils/changes/emailErrors'
import { EmailErrorMapper } from '../mappers/emailErrors'
import { EmailErrorFromModel } from '../models/emailErrors'

const Schema = new appInstance.dbs.mongo.Schema<EmailErrorFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	error: {
		type: String,
		required: true
	},
	subject: {
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
	data: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: false,
		default: {}
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

export const EmailError = appInstance.dbs.mongo.use().model<EmailErrorFromModel>('EmailError', Schema)

export const EmailErrorChange = appInstance.dbs.mongo.change(EmailError, EmailErrorDbChangeCallbacks, new EmailErrorMapper().mapFrom)