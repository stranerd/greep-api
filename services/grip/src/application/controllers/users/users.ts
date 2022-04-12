import { FindUser, GetUsers } from '@modules/users'
import { QueryParams, Request } from '@stranerd/api-commons'

export class UsersController {
	static async getUsers (req: Request) {
		const query = req.query as QueryParams
		return await GetUsers.execute(query)
	}

	static async findUser (req: Request) {
		return await FindUser.execute(req.params.id)
	}
}