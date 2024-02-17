import { ProductRepository } from './data/repositories/products'
import { ProductUseCase } from './domain/useCases/products'

import { CategoryRepository } from './data/repositories/categories'
import { CategoryUseCase } from './domain/useCases/categories'

import { CartRepository } from './data/repositories/carts'
import { CartUseCase } from './domain/useCases/carts'

const cartRepository = CartRepository.getInstance()
export const CartsUseCases = new CartUseCase(cartRepository)

const categoryRepository = CategoryRepository.getInstance()
export const CategoriesUseCases = new CategoryUseCase(categoryRepository)

const productRepository = ProductRepository.getInstance()
export const ProductsUseCases = new ProductUseCase(productRepository)
