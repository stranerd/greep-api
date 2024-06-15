import { CartProductItem } from '../domain/types'

type BaseItem = Pick<CartProductItem, 'id' | 'quantity'>
type Item = BaseItem & { addOns: BaseItem[] }
export const resolvePacks = <T extends Item>(packs: T[][]) => {
	const accumulated = packs
		.flat()
		.flatMap((pack) => [pack, ...pack.addOns])
		.reduce(
			(acc, item) => {
				acc[item.id] ??= { ...item, quantity: 0 } as any
				acc[item.id].quantity += item.quantity
				return acc
			},
			{} as Record<string, Omit<T, 'addOns'>>,
		)
	return Object.values(accumulated)
}
