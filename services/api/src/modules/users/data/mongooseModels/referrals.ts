import { appInstance } from '@utils/environment'
import { ReferralDbChangeCallbacks } from '../../utils/changes/referrals'
import { ReferralMapper } from '../mappers/referrals'
import { ReferralFromModel } from '../models/referrals'

const ReferralSchema = new appInstance.dbs.mongo.Schema<ReferralFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	userId: {
		type: String,
		required: true
	},
	referred: {
		type: String,
		required: true
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

export const Referral = appInstance.dbs.mongo.use().model<ReferralFromModel>('UsersReferral', ReferralSchema)

export const ReferralChange = appInstance.dbs.mongo.change(Referral, ReferralDbChangeCallbacks, new ReferralMapper().mapFrom)