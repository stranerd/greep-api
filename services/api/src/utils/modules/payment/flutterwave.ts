import { Currencies } from '@modules/payment'
import { flutterwaveConfig } from '@utils/environment'
import axios from 'axios'
import FlutterwaveNode from 'flutterwave-node-v3'

const flw = () => new FlutterwaveNode(flutterwaveConfig.publicKey, flutterwaveConfig.secretKey)

type FwTransaction = {
	id: number,
	tx_ref: string,
	amount: number,
	currency: string,
	status: 'successful' | 'failed',
	created_at: string,
	card: {
		first_6digits: string,
		last_4digits: string,
		country: string,
		type: string,
		token: string,
		expiry: string
	},
	customer: {
		id: number
		email: string
	}
}

type TransferRate = {
	rate: number
	source: { currency: Currencies, amount: number }
	destination: { currency: Currencies, amount: number }
}

export class FlutterwavePayment {
	private static async verifyById (transactionId: string) {
		const res = await axios.get(`/v3/transactions/verify_by_reference?tx_ref=${transactionId}`, {
			baseURL: 'https://api.flutterwave.com',
			headers: { Authorization: flutterwaveConfig.secretKey }
		}).catch(() => null)
		if (!res) return null
		if (res.data.status !== 'success') return null
		return res.data.data as FwTransaction | null
	}

	static async verify (transactionId: string, amount: number, currency: Currencies) {
		const transaction = await this.verifyById(transactionId)
		if (!transaction) return false
		if (transaction.currency !== currency || transaction.amount !== Math.abs(amount)) return false
		return transaction.status === 'successful'
	}

	static async convertAmount (amount: number, from: Currencies, to: Currencies) {
		if (from === to) return amount
		// WARN: flutterwave expects 1000 USD to NGN to have destination as USD and source as NGN, weird right
		const res = await flw().CustomRequest.custom(`v3/transfers/rates?amount=${amount}&destination_currency=${from}&source_currency=${to}`, { method: 'GET' })
			.catch(() => null)
		// TODO: figure whether to throw, and consequences of throwing in background process
		const data = res?.body?.data as TransferRate | undefined
		return data?.source.amount ?? amount
	}

	static async chargeCard (data: {
		token: string, currency: Currencies, amount: number
		email: string, id: string
	}) {
		const res = await flw().Tokenized.charge({
			token: data.token,
			currency: data.currency,
			amount: data.amount,
			email: data.email,
			tx_ref: data.id
		}).catch(() => null)
		return (res?.data as FwTransaction | null)?.status === 'successful'
	}
}