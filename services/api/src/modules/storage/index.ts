import { LocalUploaderRepository } from './data/repositories/localUploader'
import { StorageUseCase } from './domain/usecases/storage'

const uploaderRepository = new LocalUploaderRepository()

export const StorageUseCases = new StorageUseCase(uploaderRepository)
