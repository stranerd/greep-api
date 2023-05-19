import { appInstance } from '@utils/environment'
import { TokenDbChangeCallbacks } from '../../utils/changes/tokens'
import { TokenMapper } from '../mappers/tokens'
import { TokenFromModel } from '../models/tokens'

const Schema = new appInstance.dbs.mongo.Schema<TokenFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	userId: {
		type: String,
		required: true
	},
	tokens: {
		type: [String],
		required: false,
		default: []
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

export const Token = appInstance.dbs.mongo.use().model<TokenFromModel>('PushToken', Schema)

export const TokenChange = appInstance.dbs.mongo.change(Token, TokenDbChangeCallbacks, new TokenMapper().mapFrom)