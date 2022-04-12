import { BaseUseCase } from '@stranerd/api-commons'
import { IAuthRepository } from '../../i-repositories/auth'
import { UserEntity } from '../../entities/users'

type Input = {
	idToken: string
	clientId: string
	referrer: string | null
}

export class GoogleSignInUseCase implements BaseUseCase<Input, UserEntity> {
	repository: IAuthRepository

	constructor (repo: IAuthRepository) {
		this.repository = repo
	}

	async execute (input: Input) {
		return await this.repository.googleSignIn(input.idToken, input.clientId, input.referrer)
	}
}