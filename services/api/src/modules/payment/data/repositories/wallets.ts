import { appInstance } from '@utils/environment'
import { publishers } from '@utils/events'
import { BadRequestError, EmailsList, Random, readEmailFromPug } from 'equipped'
import { IWalletRepository } from '../../domain/irepositories/wallets'
import { TransactionStatus, TransactionType, TransferData, WithdrawData, WithdrawalStatus } from '../../domain/types'
import { TransactionMapper } from '../mappers/transactions'
import { WalletMapper } from '../mappers/wallets'
import { WithdrawalMapper } from '../mappers/withdrawals'
import { TransactionFromModel, TransactionToModel } from '../models/transactions'
import { WithdrawalFromModel, WithdrawalToModel } from '../models/withdrawals'
import { Transaction } from '../mongooseModels/transactions'
import { Wallet } from '../mongooseModels/wallets'
import { Withdrawal } from '../mongooseModels/withdrawals'

export class WalletRepository implements IWalletRepository {
	private static instance: WalletRepository
	private mapper: WalletMapper
	private transactionMapper: TransactionMapper
	private withdrawalMapper: WithdrawalMapper

	private constructor() {
		this.mapper = new WalletMapper()
		this.transactionMapper = new TransactionMapper()
		this.withdrawalMapper = new WithdrawalMapper()
	}

	static getInstance() {
		if (!WalletRepository.instance) WalletRepository.instance = new WalletRepository()
		return WalletRepository.instance
	}

	private static async getUserWallet(userId: string, session?: any) {
		const wallet = await Wallet.findOneAndUpdate(
			{ userId },
			{ $setOnInsert: { userId } },
			{ upsert: true, new: true, ...(session ? { session } : {}) },
		)
		return wallet!
	}

	async get(userId: string) {
		const wallet = await WalletRepository.getUserWallet(userId)
		return this.mapper.mapFrom(wallet)!
	}

	async updateAmount(userId: string, amount: number) {
		let res = false
		await Wallet.collection.conn.transaction(async (session) => {
			const wallet = this.mapper.mapFrom(await WalletRepository.getUserWallet(userId, session))!
			const updatedBalance = wallet.balance.amount + amount
			if (updatedBalance < 0) throw new BadRequestError('wallet balance can\'t go below 0')
			res = !!(await Wallet.findByIdAndUpdate(wallet.id, { $inc: { 'balance.amount': amount } }, { new: true, session }))
			return res
		})
		return res
	}

	async transfer(data: TransferData) {
		let res = null as TransactionFromModel | null
		await Wallet.collection.conn.transaction(async (session) => {
			const fromWallet = this.mapper.mapFrom(await WalletRepository.getUserWallet(data.from, session))!
			const toWallet = this.mapper.mapFrom(await WalletRepository.getUserWallet(data.to, session))!
			const updatedBalance = fromWallet.balance.amount - data.amount
			if (updatedBalance < 0) throw new BadRequestError('insufficient balance')
			const transactions: TransactionToModel[] = [
				{
					userId: data.from,
					email: data.fromEmail,
					title: `You sent money to ${data.toName}`,
					amount: 0 - data.amount,
					currency: fromWallet.balance.currency,
					status: TransactionStatus.settled,
					data: { type: TransactionType.Sent, note: data.note, to: data.to, toName: data.toName },
				},
				{
					userId: data.to,
					email: data.toEmail,
					title: `You received money from ${data.fromName}`,
					amount: data.amount,
					currency: fromWallet.balance.currency,
					status: TransactionStatus.settled,
					data: { type: TransactionType.Received, note: data.note, from: data.from, fromName: data.fromName },
				},
			]
			const transactionModels = await Transaction.insertMany(transactions, { session })
			await Wallet.findByIdAndUpdate(fromWallet.id, { $inc: { 'balance.amount': 0 - data.amount } }, { new: true, session })
			await Wallet.findByIdAndUpdate(toWallet.id, { $inc: { 'balance.amount': data.amount } }, { new: true, session })
			res = transactionModels[0]
			return res
		})
		return this.transactionMapper.mapFrom(res)!
	}

	async withdraw(data: WithdrawData) {
		let res = null as WithdrawalFromModel | null
		await Wallet.collection.conn.transaction(async (session) => {
			const wallet = this.mapper.mapFrom(await WalletRepository.getUserWallet(data.userId, session))!
			const fee = 0
			const deductingAmount = data.amount + fee
			const updatedBalance = wallet.balance.amount - deductingAmount
			if (updatedBalance < 0) throw new Error('insufficient balance')
			const withdrawalModel: WithdrawalToModel = {
				userId: data.userId,
				email: data.email,
				amount: data.amount,
				location: data.location,
				fee,
				currency: wallet.balance.currency,
				status: WithdrawalStatus.created,
			}
			const withdrawal = await new Withdrawal(withdrawalModel).save({ session })
			const transaction: TransactionToModel = {
				userId: data.userId,
				email: data.email,
				title: 'You withdrew money',
				amount: 0 - deductingAmount,
				currency: wallet.balance.currency,
				status: TransactionStatus.settled,
				data: { type: TransactionType.Withdrawal, withdrawalId: withdrawal._id },
			}
			await new Transaction(transaction).save({ session })
			await Wallet.findByIdAndUpdate(wallet.id, { $inc: { 'balance.amount': transaction.amount } }, { new: true, session })
			res = withdrawal
			return res
		})
		return this.withdrawalMapper.mapFrom(res)!
	}

	async sendPinResetMail(userId: string, email: string) {
		const token = Random.number(1e5, 1e6).toString()

		await appInstance.cache.set('transaction-pin-reset-' + token, userId, 60 * 60)
		const emailContent = await readEmailFromPug('emails/sendOTP.pug', { token })
		await publishers.SENDMAIL.publish({
			to: email,
			subject: 'Reset Your Transaction Pin',
			from: EmailsList.NO_REPLY,
			content: emailContent,
			data: {},
		})

		return true
	}

	async resetPin(userId: string, token: string, pin: string) {
		const cachedUserId = await appInstance.cache.get('transaction-pin-reset-' + token)
		if (!cachedUserId || cachedUserId !== userId) throw new BadRequestError('Invalid token')
		await appInstance.cache.delete('transaction-pin-reset-' + token)

		const wallet = await WalletRepository.getUserWallet(userId)!
		return !!(await Wallet.findByIdAndUpdate(wallet.id, { $set: { pin } }, { new: true }))
	}

	async updatePin(userId: string, oldPin: string | null, pin: string) {
		const wallet = this.mapper.mapFrom(await WalletRepository.getUserWallet(userId))!
		if (wallet.pin !== oldPin) throw new BadRequestError('invalid pin')
		return !!(await Wallet.findByIdAndUpdate(wallet.id, { $set: { pin } }, { new: true }))
	}
}
