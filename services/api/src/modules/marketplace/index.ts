import { ProductRepository } from './data/repositories/products'
import { ProductUseCase } from './domain/useCases/product'

import { CategoryRepository } from './data/repositories/categories'
import { CategoryUseCase } from './domain/useCases/category'

import { CartRepository } from './data/repositories/cart'
import { CartUseCase } from './domain/useCases/cart'

const cartRepository = CartRepository.getInstance()
export const CartUseCases = new CartUseCase(cartRepository)

const categoryRepository = CategoryRepository.getInstance()
export const CategoryUserCases = new CategoryUseCase(categoryRepository)

const productRepository = ProductRepository.getInstance()
export const ProductUseCases = new ProductUseCase(productRepository)
