import { generateChangeStreams, mongoose } from '@stranerd/api-commons'
import { ReferralFromModel } from '../models/referrals'
import { ReferralChangeStreamCallbacks } from '@utils/changeStreams/users/referrals'
import { ReferralEntity } from '../../domain/entities/referrals'
import { ReferralMapper } from '../mappers/referrals'

const ReferralSchema = new mongoose.Schema<ReferralFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
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

export const Referral = mongoose.model<ReferralFromModel>('UsersReferral', ReferralSchema)

generateChangeStreams<ReferralFromModel, ReferralEntity>(Referral, ReferralChangeStreamCallbacks, new ReferralMapper().mapFrom).then()