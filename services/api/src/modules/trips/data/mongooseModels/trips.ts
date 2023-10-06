import { appInstance } from '@utils/environment'
import { TripDbChangeCallbacks } from '../../utils/changes/trips'
import { TripMapper } from '../mappers/trips'
import { TripFromModel } from '../models/trips'

const TripSchema = new appInstance.dbs.mongo.Schema<TripFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	driverId: {
		type: String,
		required: true
	},
	status: {
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
}, { timestamps: { currentTime: Date.now }, minimize: false })

export const Trip = appInstance.dbs.mongo.use().model<TripFromModel>('UsersTrip', TripSchema)

export const TripChange = appInstance.dbs.mongo.change(Trip, TripDbChangeCallbacks, new TripMapper().mapFrom)