import { UsersUseCases, UserVendorType } from '@modules/users'
import { ProductsUseCases } from '../'

export const calculateVendorAveragePrepTime = async (vendorId: string) => {
	const products = await ProductsUseCases.get({
		where: [
			{ field: 'user.id', value: vendorId },
			{ field: 'data.type', value: UserVendorType.foods },
		],
		all: true,
	})
	const res = products.results.reduce(
		(acc, cur) => {
			if (cur.data.type === UserVendorType.foods && cur.data.prepTimeInMins) {
				acc.from += cur.data.prepTimeInMins.from
				acc.to += cur.data.prepTimeInMins.to
				acc.count += 1
			}
			return acc
		},
		{ from: 0, to: 0, count: 0 },
	)
	const avg =
		res.count === 0
			? null
			: {
					from: Math.round(res.from / res.count),
					to: Math.round(res.to / res.count),
				}

	await UsersUseCases.updateVendor({
		userId: vendorId,
		type: 'averagePrepTimeInMins',
		data: avg,
	})
}
