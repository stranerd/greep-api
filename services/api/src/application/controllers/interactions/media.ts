import { InteractionEntities, MediaUseCases, verifyInteractionAndGetUserId } from '@modules/interactions'
import { StorageUseCases } from '@modules/storage'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, NotAuthorizedError, NotFoundError, QueryParams, Request, Schema, validate } from 'equipped'

export class MediasController {
	private static schema = (fileRequired: boolean) => ({
		file: Schema.file().requiredIf(() => fileRequired),
	})

	static async get(req: Request) {
		const query = req.query as QueryParams
		return await MediaUseCases.get(query)
	}

	static async find(req: Request) {
		const media = await MediaUseCases.find(req.params.id)
		if (!media) throw new NotFoundError()
		return media
	}

	static async create(req: Request) {
		const data = validate(
			{
				...this.schema(true),
				entity: Schema.object({
					id: Schema.string().min(1),
					type: Schema.in(Object.values(InteractionEntities)),
				}),
			},
			{ ...req.body, file: req.files.file?.at(0) ?? null },
		)

		const userId = await verifyInteractionAndGetUserId(data.entity.type, data.entity.id, 'media')
		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('profile not found')

		const file = await StorageUseCases.upload('interactions/media', data.file!)

		return await MediaUseCases.create({
			file,
			entity: { ...data.entity, userId },
			user: user.getEmbedded(),
		})
	}

	static async update(req: Request) {
		const uploadedFile = req.files.photo?.at(0) ?? null
		const changedFile = !!uploadedFile

		validate(this.schema(false), { ...req.body, photo: uploadedFile })

		const file = uploadedFile ? await StorageUseCases.upload('interactions/media', uploadedFile) : undefined

		const updated = await MediaUseCases.update({
			id: req.params.id,
			userId: req.authUser!.id,
			data: {
				...(changedFile ? { file } : {}),
			},
		})
		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async delete(req: Request) {
		const isDeleted = await MediaUseCases.delete({
			id: req.params.id,
			userId: req.authUser!.id,
		})
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}
