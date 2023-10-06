import { Currencies, WithdrawalStatus } from '../../domain/types'

export interface WithdrawalFromModel extends WithdrawalToModel {
	_id: string
	agentId: string | null
	createdAt: number
	updatedAt: number
}

export interface WithdrawalToModel {
	userId: string
	email: string
	amount: number
	fee: number
	currency: Currencies
	status: WithdrawalStatus
}