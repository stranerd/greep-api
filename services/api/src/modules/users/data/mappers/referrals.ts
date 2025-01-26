import { BaseMapper } from 'equipped'
import { ReferralEntity } from '../../domain/entities/referrals'
import { ReferralFromModel, ReferralToModel } from '../models/referrals'

export class ReferralMapper extends BaseMapper<ReferralFromModel, ReferralToModel, ReferralEntity> {
	mapFrom(param: ReferralFromModel | null) {
		return !param
			? null
			: new ReferralEntity({
					id: param._id.toString(),
					referred: param.referred,
					userId: param.userId,
					createdAt: param.createdAt,
					updatedAt: param.updatedAt,
				})
	}

	mapTo(param: ReferralEntity) {
		return {
			referred: param.referred,
			userId: param.userId,
		}
	}
}
