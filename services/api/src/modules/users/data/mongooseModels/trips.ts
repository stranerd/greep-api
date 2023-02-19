import { TripDbChangeCallbacks } from '@utils/changeStreams/users/trips'
import { appInstance } from '@utils/environment'
import { mongoose } from 'equipped'
import { TripEntity } from '../../domain/entities/trips'
import { TripMapper } from '../mappers/trips'
import { TripFromModel } from '../models/trips'

const TripSchema = new mongoose.Schema<TripFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
	},
	driverId: {
		type: String,
		required: true
	},
	managerId: {
		type: String,
		required: true
	},
	status: {
		type: String,
		required: true
	},
	data: {
		type: mongoose.Schema.Types.Mixed as unknown as TripFromModel['data'],
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

export const Trip = mongoose.model<TripFromModel>('UsersTrip', TripSchema)

export const TripChange = appInstance.db
	.generateDbChange<TripFromModel, TripEntity>(Trip, TripDbChangeCallbacks, new TripMapper().mapFrom)