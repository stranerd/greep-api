import { CartLinkRepository } from './data/repositories/cartLinks'
import { CartRepository } from './data/repositories/carts'
import { OrderRepository } from './data/repositories/orders'
import { ProductRepository } from './data/repositories/products'
import { CartLinkUseCase } from './domain/useCases/cartLinks'
import { CartUseCase } from './domain/useCases/carts'
import { OrderUseCase } from './domain/useCases/orders'
import { ProductUseCase } from './domain/useCases/products'

const cartRepository = CartRepository.getInstance()
export const CartsUseCases = new CartUseCase(cartRepository)

const cartLinkRepository = CartLinkRepository.getInstance()
export const CartLinksUseCases = new CartLinkUseCase(cartLinkRepository)

const productRepository = ProductRepository.getInstance()
export const ProductsUseCases = new ProductUseCase(productRepository)

const orderRepository = OrderRepository.getInstance()
export const OrdersUseCases = new OrderUseCase(orderRepository)

export { CartLinkEntity } from './domain/entities/cartLinks'
export { CartEntity } from './domain/entities/carts'
export { OrderEntity } from './domain/entities/orders'
export { ProductEntity } from './domain/entities/products'
export {
	AddToCartInput,
	OrderDispatchDeliveryType,
	OrderFee,
	OrderPayment,
	OrderStatus,
	OrderType,
	ProductAddOn,
	ProductMeta,
} from './domain/types'
export { resolvePacks } from './utils/carts'
