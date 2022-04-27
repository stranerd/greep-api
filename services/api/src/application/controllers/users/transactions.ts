import { PaymentType, TransactionsUseCases, TransactionType, UsersUseCases } from '@modules/users'
import {
	BadRequestError,
	NotAuthorizedError,
	NotFoundError,
	QueryKeys,
	QueryParams,
	Request,
	validate,
	Validation
} from '@stranerd/api-commons'

export class TransactionsController {
	static async getTransactions (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'driverId', value: req.authUser!.id }, { field: 'managerId', value: req.authUser!.id }]
		query.authType = QueryKeys.or
		return await TransactionsUseCases.get(query)
	}

	static async findTransaction (req: Request) {
		const transaction = await TransactionsUseCases.find({
			id: req.params.id, userId: req.authUser!.id
		})
		if (!transaction) throw new NotFoundError()
		return transaction
	}

	static async createTransaction (req: Request) {
		const isExpense = req.body.data?.type === TransactionType.expense
		const isBalance = req.body.data?.type === TransactionType.balance
		const isTrip = req.body.data?.type === TransactionType.trip

		const bodyAmount = req.body.amount
		const {
			amount,
			description,
			recordedAt,
			type,
			name,
			parentId,
			customerName,
			paidAmount,
			paymentType
		} = validate({
			amount: bodyAmount,
			description: req.body.description,
			recordedAt: req.body.recordedAt,
			type: req.body.data?.type,
			name: req.body.data?.name,
			parentId: req.body.data?.parentId,
			paidAmount: req.body.data?.paidAmount,
			customerName: req.body.data?.customerName,
			paymentType: req.body.data?.paymentType
		}, {
			amount: { required: true, rules: [Validation.isNumber, Validation.isMoreThanX(0)] },
			description: { required: true, rules: [Validation.isString] },
			recordedAt: { required: true, rules: [Validation.isNumber, Validation.isMoreThanX(0)] },
			type: {
				required: true,
				rules: [Validation.isString, Validation.arrayContainsX(Object.values(TransactionType), (cur, val) => cur === val)]
			},
			name: {
				required: isExpense,
				rules: [Validation.isString, Validation.isLongerThanX(0)]
			},
			parentId: { required: isBalance, rules: [Validation.isString] },
			customerName: {
				required: isTrip,
				rules: [Validation.isString, Validation.isLongerThanX(0)]
			},
			paidAmount: {
				required: isTrip,
				rules: [Validation.isNumber, Validation.isLessThanOrEqualToX(bodyAmount)]
			},
			paymentType: {
				required: isTrip,
				rules: [Validation.isString, Validation.arrayContainsX(Object.values(PaymentType), (cur, val) => cur === val)]
			}
		})

		const driverId = req.authUser!.id
		const driver = await UsersUseCases.find(driverId)
		if (!driver) throw new BadRequestError('profile not found')

		if (isBalance) {
			const parent = await TransactionsUseCases.find({ id: parentId, userId: driverId })
			if (!parent) throw new BadRequestError('parent transaction not found')
			if (parent.driverId !== driverId) throw new BadRequestError('parent transaction isn\'t yours')
			if (parent.data.type !== TransactionType.trip) throw new BadRequestError('parent transaction is not a trip type')
			if (parent.data.debt === 0) throw new BadRequestError('parent transaction is settled already')
			if (parent.data.debt < amount) throw new BadRequestError('amount is greater than the debt to settle')
		}

		return await TransactionsUseCases.create({
			amount, description, recordedAt, driverId, managerId: driver.manager?.managerId ?? driverId,
			data: isExpense ? { type, name } :
				isBalance ? { type, parentId } :
					isTrip ? {
						type,
						customerName,
						paidAmount,
						paymentType,
						debt: amount - paidAmount
					} : ({} as any)
		})
	}

	static async deleteTransaction (req: Request) {
		const isDeleted = await TransactionsUseCases.delete({ id: req.params.id, managerId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}