import { TagMeta, TagTypes, TagsUseCases } from '@modules/interactions'
import { ProductMeta, ProductsUseCases } from '@modules/marketplace'
import { Currencies } from '@modules/payment'
import { StorageUseCases } from '@modules/storage'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, Conditions, NotAuthorizedError, NotFoundError, QueryParams, Request, Schema, validate } from 'equipped'

export class ProductsController {
	private static schema = (bannerRequired: boolean) => ({
		title: Schema.string().min(1),
		description: Schema.string().min(1),
		price: Schema.object({
			amount: Schema.number().gt(0),
			currency: Schema.in(Object.values(Currencies)),
		}),
		inStock: Schema.boolean(),
		tagIds: Schema.array(Schema.string().min(1)),
		banner: Schema.file()
			.image()
			.requiredIf(() => bannerRequired),
	})

	static async get(req: Request) {
		const query = req.query as QueryParams
		return await ProductsUseCases.get(query)
	}

	static async find(req: Request) {
		const product = await ProductsUseCases.find(req.params.id)
		if (!product) throw new NotFoundError()
		return product
	}

	static async delete(req: Request) {
		const deleted = await ProductsUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
		if (deleted) return deleted
		throw new NotAuthorizedError()
	}

	static async update(req: Request) {
		const uploadedBanner = req.files.photo?.at(0) ?? null
		const changedBanner = !!uploadedBanner

		const { title, description, price, tagIds } = validate(this.schema(false), { ...req.body, banner: uploadedBanner })

		const { results: tags } = await TagsUseCases.get({
			where: [{ field: 'id', condition: Conditions.in, value: tagIds }],
		})

		const banner = uploadedBanner ? await StorageUseCases.upload('marketplace/banners', uploadedBanner) : undefined

		const updatedBanner = await ProductsUseCases.update({
			id: req.params.id,
			userId: req.authUser!.id,
			data: {
				title,
				description,
				price,
				tagIds: tags.map((t) => t.id),
				...(changedBanner ? { photo: banner } : {}),
			},
		})
		if (updatedBanner) return updatedBanner
		throw new NotAuthorizedError()
	}

	static async create(req: Request) {
		const data = validate(this.schema(true), { ...req.body, banner: req.files.banner?.at(0) ?? null })

		const { results: tags } = await TagsUseCases.get({
			where: [{ field: 'id', condition: Conditions.in, value: data.tagIds }],
		})

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('user not found')
		if (!user.vendor?.location)
			throw new BadRequestError('you must set your vendor location before you can list products on the marketplace')

		const banner = await StorageUseCases.upload('marketplace/banners', data.banner!)

		return await ProductsUseCases.create({
			...data,
			tagIds: tags.map((t) => t.id),
			user: user.getEmbedded(),
			banner,
		})
	}

	static async recommendTags(req: Request) {
		const query: QueryParams = req.query
		query.auth = [{ field: 'type', value: TagTypes.products }]
		query.sort ??= []
		query.sort.unshift({ field: `meta.${TagMeta.orders}`, desc: true })
		query.limit = 10
		return await TagsUseCases.get(query)
	}

	static async recommendProducts(req: Request) {
		const query: QueryParams = req.query
		query.sort ??= []
		query.sort.unshift({ field: `meta.${ProductMeta.orders}`, desc: true })
		return await ProductsUseCases.get(query)
	}
}
