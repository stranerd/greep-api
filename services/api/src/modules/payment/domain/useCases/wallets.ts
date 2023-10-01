import { IWalletRepository } from '../irepositories/wallets'
import { TransferData } from '../types'

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

	async transfer (data: TransferData) {
		return await this.repository.transfer(data)
	}

	async updatePin (data: { userId: string, oldPin: string | null, pin: string }) {
		return await this.repository.updatePin(data.userId, data.oldPin, data.pin)
	}
}