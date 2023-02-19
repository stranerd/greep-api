import { UserDbChangeCallbacks } from '@utils/changeStreams/users/users'
import { appInstance } from '@utils/environment'
import { mongoose } from 'equipped'
import { UserEntity } from '../../domain/entities/users'
import { UserMapper } from '../mappers/users'
import { UserFromModel } from '../models/users'

const UserSchema = new mongoose.Schema<UserFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
	},
	bio: {
		type: mongoose.Schema.Types.Mixed as unknown as UserFromModel['bio'],
		required: true
	},
	roles: {
		type: mongoose.Schema.Types.Mixed as unknown as UserFromModel['roles'],
		required: false,
		default: {} as unknown as UserFromModel['roles']
	},
	dates: {
		createdAt: {
			type: Number,
			required: false,
			default: Date.now
		},
		deletedAt: {
			type: Number,
			required: false,
			default: null
		}
	},
	status: {
		connections: {
			type: [String],
			required: false,
			default: []
		},
		lastUpdatedAt: {
			type: Number,
			required: false,
			default: 0
		}
	},
	drivers: {
		type: [mongoose.Schema.Types.Mixed] as unknown as UserFromModel['drivers'],
		required: false,
		default: []
	},
	managerRequests: {
		type: [mongoose.Schema.Types.Mixed] as unknown as UserFromModel['managerRequests'],
		required: false,
		default: []
	},
	pushTokens: {
		type: [String],
		required: false,
		default: []
	},
	manager: {
		type: mongoose.Schema.Types.Mixed as unknown as UserFromModel['manager'],
		required: false,
		default: null
	}
}, { minimize: false })

export const User = mongoose.model<UserFromModel>('User', UserSchema)

export const UserChange = appInstance.db
	.generateDbChange<UserFromModel, UserEntity>(User, UserDbChangeCallbacks, new UserMapper().mapFrom)