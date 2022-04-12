import { LocalUploaderRepository } from './data/repositories/localUploader'
import { UploadFileUseCase } from './domain/usecases/uploadFile'
import { DeleteFileUseCase } from './domain/usecases/deleteFile'

const uploaderRepository = new LocalUploaderRepository()

export const UploadFile = new UploadFileUseCase(uploaderRepository)
export const DeleteFile = new DeleteFileUseCase(uploaderRepository)