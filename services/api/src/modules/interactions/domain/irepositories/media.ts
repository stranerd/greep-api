import { QueryParams, QueryResults } from 'equipped'
import { MediaToModel } from '../../data/models/media'
import { MediaEntity } from '../entities/media'
import { Interaction } from '../types'

export interface IMediaRepository {
	add: (data: MediaToModel) => Promise<MediaEntity>
	get: (query: QueryParams) => Promise<QueryResults<MediaEntity>>
	find: (id: string) => Promise<MediaEntity | null>
	update: (id: string, userId: string, data: Partial<MediaToModel>) => Promise<MediaEntity | null>
	delete: (id: string, userId: string) => Promise<boolean>
	deleteEntityMedias: (entity: Interaction) => Promise<boolean>
	updateUserBio: (user: MediaToModel['user']) => Promise<boolean>
}
