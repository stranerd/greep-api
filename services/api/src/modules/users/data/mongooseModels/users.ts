import { appInstance } from '@utils/environment'
import { UserMeta, UserRankings } from '../../domain/types'
import { UserDbChangeCallbacks } from '../../utils/changes/users'
import { UserMapper } from '../mappers/users'
import { UserFromModel } from '../models/users'

const UserSchema = new appInstance.dbs.mongo.Schema<UserFromModel>(
	{
		_id: {
			type: String,
			default: () => appInstance.dbs.mongo.Id.toString(),
		},
		bio: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: true,
		},
		roles: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: false,
			default: {} as unknown as UserFromModel['roles'],
		},
		dates: {
			createdAt: {
				type: Number,
				required: false,
				default: Date.now,
			},
			deletedAt: {
				type: Number,
				required: false,
				default: null,
			},
		},
		status: {
			connections: {
				type: [String],
				required: false,
				default: [],
			},
			lastUpdatedAt: {
				type: Number,
				required: false,
				default: 0,
			},
		},
		account: {
			meta: Object.fromEntries(
				Object.values(UserMeta).map((key) => [
					key,
					{
						type: Number,
						required: false,
						default: 0,
					},
				]),
			),
			rankings: Object.fromEntries(
				Object.keys(UserRankings).map((key) => [
					key,
					{
						value: {
							type: Number,
							required: false,
							default: 0,
						},
						lastUpdatedAt: {
							type: Number,
							required: false,
							default: Date.now(),
						},
					},
				]),
			),
			application: {
				type: appInstance.dbs.mongo.Schema.Types.Mixed,
				required: false,
				default: null,
			},
			trips: {
				type: appInstance.dbs.mongo.Schema.Types.Mixed,
				required: false,
				default: {},
			},
			location: {
				type: [Number],
				required: false,
				default: null,
			},
			vendorLocation: {
				type: [appInstance.dbs.mongo.Schema.Types.Mixed],
				required: false,
				default: null,
			},
			savedLocations: {
				type: [appInstance.dbs.mongo.Schema.Types.Mixed],
				required: false,
				default: [],
			},
			settings: {
				notifications: {
					type: Boolean,
					required: false,
					default: true,
				},
				driverAvailable: {
					type: Boolean,
					required: false,
					default: true,
				},
			},
		},
		type: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: false,
			default: null,
		},
	},
	{ minimize: false },
)

export const User = appInstance.dbs.mongo.use().model<UserFromModel>('User', UserSchema)

export const UserChange = appInstance.dbs.mongo.change(User, UserDbChangeCallbacks, new UserMapper().mapFrom)
