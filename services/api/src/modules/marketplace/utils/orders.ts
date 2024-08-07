import { mergeWithUsers } from '@modules/users'
import { BaseEntity, Conditions } from 'equipped'
import { OrderEntity, ProductsUseCases } from '../'
import { EmbeddedProduct } from '../domain/entities/products'

const mergeWithProducts = async <T extends BaseEntity<{ products: Record<string, EmbeddedProduct | null> }, any>>(
	entities: T[],
	getIds: (e: T) => string[],
) => {
	const ids = [...new Set(entities.flatMap((e) => getIds(e)))]
	const { results } = await ProductsUseCases.get({ where: [{ field: 'id', condition: Conditions.in, value: ids }] })
	const map = new Map(results.map((i) => [i.id, i.getEmbedded()]))
	return entities.map((e) => {
		e.products = getIds(e).reduce(
			(acc, id) => {
				acc[id] = map.get(id) ?? null
				return acc
			},
			{} as Record<string, EmbeddedProduct | null>,
		)
		return e
	})
}

export const mergeOrdersData = async (orders: OrderEntity[]) =>
	await mergeWithUsers(orders, (e) => e.getMembers()).then((res) => mergeWithProducts(res, (e) => e.getProductIds()))
