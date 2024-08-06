import { CartProductItem } from '../domain/types'

type Item = Omit<CartProductItem, 'price' | 'addOns'> & { addOns: Omit<CartProductItem['addOns'][number], 'price'>[] }
export const resolvePacks = <T extends Item>(packs: T[][]) => {
	const accumulated = packs.flat().reduce(
		(acc, item) => {
			const { addOns, ...itemsWithoutAddons } = item
			acc[item.id] ??= { ...itemsWithoutAddons, quantity: 0, addOns: {} }
			acc[item.id].quantity += item.quantity
			addOns.map((addOn) => {
				const key = `${addOn.groupName}/${addOn.itemName}`
				acc[item.id].addOns[key] ??= { ...addOn, quantity: 0 }
				acc[item.id].addOns[key].quantity += addOn.quantity
			})
			return acc
		},
		{} as Record<string, Omit<T, 'addOns'> & { addOns: Record<string, T['addOns'][number]> }>,
	)
	return Object.values(accumulated)
}
