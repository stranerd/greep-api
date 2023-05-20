import { appInstance } from '@utils/environment'
import { UserDbChangeCallbacks } from '../../utils/changes/users'
import { UserMapper } from '../mappers/users'
import { UserFromModel } from '../models/users'

const UserSchema = new appInstance.dbs.mongo.Schema<UserFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	bio: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true
	},
	roles: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
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
		type: [appInstance.dbs.mongo.Schema.Types.Mixed] as unknown as UserFromModel['drivers'],
		required: false,
		default: []
	},
	managerRequests: {
		type: [appInstance.dbs.mongo.Schema.Types.Mixed] as unknown as UserFromModel['managerRequests'],
		required: false,
		default: []
	},
	manager: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: false,
		default: null
	}
}, { minimize: false })

export const User = appInstance.dbs.mongo.use().model<UserFromModel>('User', UserSchema)

export const UserChange = appInstance.dbs.mongo.change(User, UserDbChangeCallbacks, new UserMapper().mapFrom)