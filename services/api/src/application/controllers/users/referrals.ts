import { ReferralsUseCases } from '@modules/users'
import { QueryParams, Request } from '@stranerd/api-commons'

export class ReferralsController {
	static async getReferrals (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'userId', value: req.authUser!.id }]
		return await ReferralsUseCases.getReferrals(query)
	}

	static async findReferral (req: Request) {
		return await ReferralsUseCases.findReferral({
			id: req.params.id,
			userId: req.authUser!.id
		})
	}
}