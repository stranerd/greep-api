import { UserDbChangeCallbacks } from '@utils/changeStreams/auth/users'
import { appInstance } from '@utils/environment'
import { UserMapper } from '../mappers/users'
import { UserFromModel } from '../models/users'

const UserSchema = new appInstance.dbs.mongo.Schema<UserFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	email: {
		type: String,
		trim: true,
		lowercase: true,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: false,
		default: ''
	},
	name: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true
	},
	photo: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: false,
		default: null
	},
	isVerified: {
		type: Boolean,
		required: false,
		default: false
	},
	authTypes: {
		type: [String],
		set: (types: string[]) => Array.from(new Set(types)),
		required: false,
		default: []
	},
	roles: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: false,
		default: {} as unknown as UserFromModel['roles']
	},

	lastSignedInAt: {
		type: Number,
		required: false,
		default: Date.now
	},
	signedUpAt: {
		type: Number,
		required: false,
		default: Date.now
	}
})

export const User = appInstance.dbs.mongo.use().model<UserFromModel>('AuthUser', UserSchema)

export const UserChange = appInstance.dbs.mongo.change(User, UserDbChangeCallbacks, new UserMapper().mapFrom)

export default User