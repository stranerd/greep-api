import { ProductRepository } from './data/repositories/products'
import { ProductUseCase } from './domain/useCases/product'

const productRepository = ProductRepository.getInstance()
export const ProductUseCases = new ProductUseCase(productRepository)

