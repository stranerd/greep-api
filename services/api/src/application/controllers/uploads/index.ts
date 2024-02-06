import { StorageUseCases } from '@modules/storage'
import { Request, Schema, validate } from 'equipped'

export class UploadsController {
	static async upload(req: Request) {
		const data = validate(
			{
				files: Schema.array(Schema.file()),
			},
			{ files: req.files.files },
		)

		const files = data.files.map(async (file) => {
			const uploaded = await StorageUseCases.upload('uploads/', file)
			return uploaded
		})

		return files
	}
}
