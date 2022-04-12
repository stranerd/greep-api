import { BaseUseCase } from '@stranerd/api-commons'
import { IAuthRepository } from '../../i-repositories/auth'

type Input = {
	email: string
	redirectUrl: string
}

export class SendPasswordResetMailUseCase implements BaseUseCase<Input, boolean> {
	repository: IAuthRepository

	constructor (repo: IAuthRepository) {
		this.repository = repo
	}

	async execute (input: Input) {
		return await this.repository.sendPasswordResetMail(input.email, input.redirectUrl)
	}
}