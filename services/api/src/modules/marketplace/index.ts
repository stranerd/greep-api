import { CartRepository } from './data/repositories/carts'
import { CategoryRepository } from './data/repositories/categories'
import { OrderRepository } from './data/repositories/orders'
import { ProductRepository } from './data/repositories/products'
import { CartUseCase } from './domain/useCases/carts'
import { CategoryUseCase } from './domain/useCases/categories'
import { OrderUseCase } from './domain/useCases/orders'
import { ProductUseCase } from './domain/useCases/products'

const cartRepository = CartRepository.getInstance()
export const CartsUseCases = new CartUseCase(cartRepository)

const categoryRepository = CategoryRepository.getInstance()
export const CategoriesUseCases = new CategoryUseCase(categoryRepository)

const productRepository = ProductRepository.getInstance()
export const ProductsUseCases = new ProductUseCase(productRepository)

const orderRepository = OrderRepository.getInstance()
export const OrdersUseCases = new OrderUseCase(orderRepository)

export { OrderPayment } from './domain/types'
