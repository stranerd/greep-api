import { DeliveryStatus } from '../../domain/types'
import { appInstance } from '@utils/environment'
import { NotAuthorizedError, QueryParams, Random } from 'equipped'
import { IDeliveryRepository } from '../../domain/irepositories/deliveries'
import { DeliveryMapper } from '../mappers/deliveries'
import { DeliveryToModel } from '../models/deliveries'
import { Delivery } from '../mongooseModels/deliveries'

export class DeliveryRepository implements IDeliveryRepository {
	private static instance: DeliveryRepository
	private mapper: DeliveryMapper

	private constructor() {
		this.mapper = new DeliveryMapper()
	}

	static getInstance() {
		if (!DeliveryRepository.instance) DeliveryRepository.instance = new DeliveryRepository()
		return DeliveryRepository.instance
	}

	async get(query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Delivery, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!),
		}
	}

	async find(id: string) {
		const delivery = await Delivery.findById(id)
		return this.mapper.mapFrom(delivery)
	}

	async create(data: DeliveryToModel) {
		const delivery = await new Delivery(data).save()
		return this.mapper.mapFrom(delivery)!
	}

	async update(id: string, data: Partial<DeliveryToModel>) {
		const delivery = await Delivery.findByIdAndUpdate(id, { $set: data }, { new: true })
		return this.mapper.mapFrom(delivery)
	}

	async assignDriver(id: string, driverId: string) {
		const delivery = await Delivery.findOneAndUpdate(
			{
				_id: id,
				agentId: null,
				status: DeliveryStatus.created,
			},
			{ $set: { driverId, status: DeliveryStatus.inProgress } },
			{ new: true },
		)
		return this.mapper.mapFrom(delivery)
	}

	async generateToken(id: string, userId: string) {
		const delivery = await Delivery.findById(id)
		if (!delivery || delivery.userId !== userId) throw new NotAuthorizedError()
		if (delivery.status !== DeliveryStatus.inProgress) throw new NotAuthorizedError('Delivery is not in progress')
		const token = Random.string(12)
		await appInstance.cache.set(`delivery-token-${token}`, id, 60 * 3)
		return token
	}

	async complete(id: string, userId: string, token: string) {
		const delivery = await Delivery.findById(id)
		if (!delivery || delivery.userId !== userId) throw new NotAuthorizedError()
		if (delivery.status !== DeliveryStatus.inProgress) throw new NotAuthorizedError('Delivery is not in progress')
		const cachedId = await appInstance.cache.get(`delivery-token-${token}`)
		if (cachedId !== id) throw new NotAuthorizedError('invalid token')
		const completed = await Delivery.findByIdAndUpdate(id, { $set: { status: DeliveryStatus.completed } }, { new: true })
		return this.mapper.mapFrom(completed)
	}
}
