import { IWalletRepository } from '../irepositories/wallets'

export class WalletsUseCase {
	repository: IWalletRepository

	constructor (repo: IWalletRepository) {
		this.repository = repo
	}

	async get (userId: string) {
		return await this.repository.get(userId)
	}

	async updateAmount (data: { userId: string, amount: number }) {
		return await this.repository.updateAmount(data.userId, data.amount)
	}
}