import { IWalletRepository } from '../irepositories/wallets'
import { Currencies, TransferData, WithdrawData } from '../types'

export class WalletsUseCase {
	repository: IWalletRepository

	constructor(repo: IWalletRepository) {
		this.repository = repo
	}

	async get(userId: string) {
		return await this.repository.get(userId)
	}

	async updateAmount(data: { userId: string; amount: number; currency: Currencies }) {
		return await this.repository.updateAmount(data.userId, data.amount, data.currency)
	}

	async transfer(data: TransferData) {
		return await this.repository.transfer(data)
	}

	async withdraw(data: WithdrawData) {
		return await this.repository.withdraw(data)
	}

	async sendPinResetMail(data: { userId: string; email: string }) {
		return await this.repository.sendPinResetMail(data.userId, data.email)
	}

	async resetPin(data: { userId: string; token: string; pin: string }) {
		return await this.repository.resetPin(data.userId, data.token, data.pin)
	}

	async updatePin(data: { userId: string; oldPin: string | null; pin: string }) {
		return await this.repository.updatePin(data.userId, data.oldPin, data.pin)
	}
}
