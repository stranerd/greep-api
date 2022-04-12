import { BaseUseCase } from '@stranerd/api-commons'
import { UserEntity } from '../../entities/users'
import { IUserRepository } from '../../i-repositories/users'

export class FindUserByEmailUseCase implements BaseUseCase<string, UserEntity | null> {
	repository: IUserRepository

	constructor (repo: IUserRepository) {
		this.repository = repo
	}

	async execute (email: string) {
		const res = await this.repository.getUsers({
			where: [{ field: 'email', value: email.toLowerCase() }],
			limit: 1
		})
		return res.results[0] ?? null
	}
}