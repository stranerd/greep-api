import { appInstance } from '@utils/environment'
import { QueryParams } from 'equipped'
import { ITagRepository } from '../../domain/irepositories/tags'
import { TagMeta, TagTypes } from '../../domain/types'
import { TagMapper } from '../mappers/tags'
import { TagFromModel, TagToModel } from '../models/tags'
import { Tag } from '../mongooseModels/tags'

export class TagRepository implements ITagRepository {
	private static instance: TagRepository
	private mapper: TagMapper

	private constructor() {
		this.mapper = new TagMapper()
	}

	static getInstance() {
		if (!TagRepository.instance) TagRepository.instance = new TagRepository()
		return TagRepository.instance
	}

	async get(query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Tag, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!),
		}
	}

	async add(data: TagToModel) {
		data.title = data.title.toLowerCase().trim()
		const tag = await new Tag(data).save()
		return this.mapper.mapFrom(tag)!
	}

	async find(id: string) {
		const tag = await Tag.findById(id)
		return this.mapper.mapFrom(tag)
	}

	async update(id: string, data: Partial<TagToModel>) {
		if (data.title) data.title = data.title.toLowerCase().trim()
		const tag = await Tag.findOneAndUpdate({ _id: id }, { $set: data }, { new: true })
		return this.mapper.mapFrom(tag)
	}

	async delete(id: string) {
		const tag = await Tag.findOneAndDelete({ _id: id })
		return !!tag
	}

	async updateMeta(ids: string[], property: TagMeta, value: 1 | -1) {
		await Tag.updateMany(
			{ _id: { $in: ids } },
			{
				$inc: { [`meta.${property}`]: value, [`meta.${TagMeta.total}`]: value },
			},
		)
	}

	async autoCreate(type: TagTypes, titles: string[]) {
		let res: TagFromModel[] = []
		await Tag.collection.conn.transaction(async (session) => {
			res = await Promise.all(
				titles.map(async (title) => {
					title = title.toLowerCase().trim()
					return await Tag.findOneAndUpdate(
						{ type, title: new RegExp(`^${title}$`, 'i') },
						{ $setOnInsert: { type, title, parent: null, photo: null } },
						{ session, upsert: true, new: true },
					)
				}),
			)
			return res
		})
		return res.map((r) => this.mapper.mapFrom(r)!)
	}
}
