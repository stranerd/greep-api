import { QueryParams } from 'equipped'
import { ReportToModel } from '../../data/models/reports'
import { IReportRepository } from '../irepositories/reports'
import { EmbeddedUser, Interaction } from '../types'

export class ReportsUseCase {
	repository: IReportRepository

	constructor(repo: IReportRepository) {
		this.repository = repo
	}

	async create(input: ReportToModel) {
		return await this.repository.create(input)
	}

	async delete(id: string) {
		return await this.repository.delete(id)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async get(query: QueryParams) {
		return await this.repository.get(query)
	}

	async updateUserBio(user: EmbeddedUser) {
		return await this.repository.updateUserBio(user)
	}

	async deleteEntityReports(entity: Interaction) {
		return await this.repository.deleteEntityReports(entity)
	}
}
