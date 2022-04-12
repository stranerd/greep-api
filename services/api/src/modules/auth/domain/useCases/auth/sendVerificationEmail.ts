import { BaseUseCase } from '@stranerd/api-commons'
import { IAuthRepository } from '../../i-repositories/auth'

type Input = {
	email: string,
	redirectUrl: string
}

export class SendVerificationEmailUseCase implements BaseUseCase<Input, boolean> {
	repository: IAuthRepository

	constructor (repo: IAuthRepository) {
		this.repository = repo
	}

	async execute (input: Input) {
		return await this.repository.sendVerificationMail(input.email, input.redirectUrl)
	}
}