import { appInstance } from '@utils/environment'
import { CustomerMapper } from '../mappers/customers'
import { CustomerFromModel } from '../models/customers'

const CustomerSchema = new appInstance.dbs.mongo.Schema<CustomerFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
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

export const Customer = appInstance.dbs.mongo.use().model<CustomerFromModel>('UsersCustomer', CustomerSchema)

export const CustomerChange = appInstance.dbs.mongo.change(Customer, {}, new CustomerMapper().mapFrom)