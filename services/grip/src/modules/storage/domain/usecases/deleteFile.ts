import { IUploaderRepository } from '../irepositories/uploader'

export class DeleteFileUseCase {
	private readonly uploader: IUploaderRepository

	constructor (uploader: IUploaderRepository) {
		this.uploader = uploader
	}

	async call (path: string) {
		return await this.uploader.delete(path)
	}
}