import { TagMeta } from '@modules/interactions'
import { Currencies } from '@modules/payment'
import { UserVendorType, generateDefaultUser } from '@modules/users'
import { Ratings } from '@utils/types'
import { BaseEntity, MediaOutput } from 'equipped'
import { EmbeddedUser, ProductAddOns, ProductData, ProductMetaType } from '../types'

type ProductEntityProps = {
	id: string
	title: string
	price: {
		amount: number
		currency: Currencies
	}
	data: ProductData
	user: EmbeddedUser
	banner: MediaOutput
	description: string
	tagIds: string[]
	inStock: boolean
	addOns: ProductAddOns
	meta: ProductMetaType
	ratings: Ratings
	createdAt: number
	updatedAt: number
}

export class ProductEntity extends BaseEntity<ProductEntityProps> {
	constructor(data: ProductEntityProps) {
		data.user = generateDefaultUser(data.user)
		super(data)
	}

	getTagMetaType() {
		return this.data.type === UserVendorType.foods ? TagMeta.productsFoods : TagMeta.productsItems
	}

	private buildAddonKey(groupName: string, itemName: string) {
		return `${itemName}(${groupName})`
	}

	get addOnsMap() {
		return Object.fromEntries(
			Object.entries(this.addOns)
				.flatMap(([groupName, { items, ...group }]) =>
					Object.entries(items).map(([itemName, item]) => ({ ...group, ...item, groupName, itemName })),
				)
				.map((item) => [this.buildAddonKey(item.groupName, item.itemName), item] as const),
		)
	}

	getAddOn(groupName: string, itemName: string) {
		return this.addOnsMap[this.buildAddonKey(groupName, itemName)]
	}
}
