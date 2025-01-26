import { appInstance } from '@utils/environment'
import { QueryParams } from 'equipped'
import { ICartLinkRepository } from '../../domain/irepositories/cartLinks'
import { CartLinkMapper } from '../mappers/cartLinks'
import { CartLinkToModel } from '../models/cartLinks'
import { CartLink } from '../mongooseModels/cartLinks'

export class CartLinkRepository implements ICartLinkRepository {
	private static instance: CartLinkRepository
	private mapper = new CartLinkMapper()

	static getInstance(): CartLinkRepository {
		if (!CartLinkRepository.instance) CartLinkRepository.instance = new CartLinkRepository()
		return CartLinkRepository.instance
	}

	async create(data: CartLinkToModel) {
		const cartlink = await new CartLink(data).save()
		return this.mapper.mapFrom(cartlink)!
	}

	async get(query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(CartLink, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!),
		}
	}

	async find(id: string) {
		const cartLink = await CartLink.findById(id)
		return this.mapper.mapFrom(cartLink)
	}

	async update(id: string, userId: string, data: Partial<CartLinkToModel>) {
		const cartLink = await CartLink.findOneAndUpdate({ _id: id, 'user.id': userId }, { $set: data }, { new: true })
		return this.mapper.mapFrom(cartLink)
	}
}
