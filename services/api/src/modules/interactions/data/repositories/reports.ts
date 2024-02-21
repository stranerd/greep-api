import { appInstance } from '@utils/environment'
import { QueryParams } from 'equipped'
import { IReportRepository } from '../../domain/irepositories/reports'
import { EmbeddedUser, Interaction } from '../../domain/types'
import { ReportMapper } from '../mappers/reports'
import { ReportToModel } from '../models/reports'
import { Report } from '../mongooseModels/reports'

export class ReportRepository implements IReportRepository {
	private static instance: ReportRepository
	private mapper = new ReportMapper()

	static getInstance(): ReportRepository {
		if (!ReportRepository.instance) ReportRepository.instance = new ReportRepository()
		return ReportRepository.instance
	}

	async get(query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Report, query)
		return {
			...data,
			results: data.results.map((n) => this.mapper.mapFrom(n)!),
		}
	}

	async find(id: string) {
		const report = await Report.findById(id)
		return this.mapper.mapFrom(report)
	}

	async create(data: ReportToModel) {
		const report = await Report.findOneAndUpdate(
			{ 'user.id': data.user.id, message: data.message, entity: data.entity },
			{ $setOnInsert: data },
			{ new: true, upsert: true },
		)
		return this.mapper.mapFrom(report)!
	}

	async delete(id: string) {
		const report = await Report.findByIdAndDelete(id)
		return !!report
	}

	async updateUserBio(user: EmbeddedUser) {
		const res = await Report.updateMany({ 'user.id': user.id }, { user })
		return !!res.acknowledged
	}

	async deleteEntityReports({ type, id }: Interaction) {
		const reports = await Report.deleteMany({ 'entity.type': type, 'entity.id': id })
		return !!reports.acknowledged
	}
}
