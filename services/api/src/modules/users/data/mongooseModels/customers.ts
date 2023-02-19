import { CustomerDbChangeCallbacks } from '@utils/changeStreams/users/customers'
import { appInstance } from '@utils/environment'
import { mongoose } from 'equipped'
import { CustomerEntity } from '../../domain/entities/customers'
import { CustomerMapper } from '../mappers/customers'
import { CustomerFromModel } from '../models/customers'

const CustomerSchema = new mongoose.Schema<CustomerFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
	},
	name: {
		type: String,
		required: true
	},
	driverId: {
		type: String,
		required: true
	},
	trips: {
		type: Number,
		required: false,
		default: 0
	},
	debt: {
		type: Number,
		required: false,
		default: 0
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

export const Customer = mongoose.model<CustomerFromModel>('UsersCustomer', CustomerSchema)

export const CustomerChange = appInstance.db
	.generateDbChange<CustomerFromModel, CustomerEntity>(Customer, CustomerDbChangeCallbacks, new CustomerMapper().mapFrom)