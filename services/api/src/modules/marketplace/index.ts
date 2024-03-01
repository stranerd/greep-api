import { CartRepository } from './data/repositories/carts'
import { DeliveryRepository } from './data/repositories/deliveries'
import { OrderRepository } from './data/repositories/orders'
import { ProductRepository } from './data/repositories/products'
import { CartUseCase } from './domain/useCases/carts'
import { DeliveryUseCase } from './domain/useCases/deliveries'
import { OrderUseCase } from './domain/useCases/orders'
import { ProductUseCase } from './domain/useCases/products'

const cartRepository = CartRepository.getInstance()
export const CartsUseCases = new CartUseCase(cartRepository)

const productRepository = ProductRepository.getInstance()
export const ProductsUseCases = new ProductUseCase(productRepository)

const orderRepository = OrderRepository.getInstance()
export const OrdersUseCases = new OrderUseCase(orderRepository)

const deliveryRepository = DeliveryRepository.getInstance()
export const DeliveriesUseCases = new DeliveryUseCase(deliveryRepository)

export { OrderPayment } from './domain/types'
