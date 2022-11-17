import { generateChangeStreams, mongoose } from '@stranerd/api-commons'
import { TripFromModel } from '../models/trips'
import { TripChangeStreamCallbacks } from '@utils/changeStreams/users/trips'
import { TripEntity } from '../../domain/entities/trips'
import { TripMapper } from '../mappers/trips'

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

generateChangeStreams<TripFromModel, TripEntity>(Trip, TripChangeStreamCallbacks, new TripMapper().mapFrom).then()