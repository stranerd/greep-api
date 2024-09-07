import { CartLinkRepository } from './data/repositories/cartLinks'
import { CartRepository } from './data/repositories/carts'
import { OrderRepository } from './data/repositories/orders'
import { ProductRepository } from './data/repositories/products'
import { PromotionRepository } from './data/repositories/promotions'
import { CartLinkUseCase } from './domain/useCases/cartLinks'
import { CartUseCase } from './domain/useCases/carts'
import { OrderUseCase } from './domain/useCases/orders'
import { ProductUseCase } from './domain/useCases/products'
import { PromotionUseCase } from './domain/useCases/promotions'

const cartRepository = CartRepository.getInstance()
export const CartsUseCases = new CartUseCase(cartRepository)

const cartLinkRepository = CartLinkRepository.getInstance()
export const CartLinksUseCases = new CartLinkUseCase(cartLinkRepository)

const orderRepository = OrderRepository.getInstance()
export const OrdersUseCases = new OrderUseCase(orderRepository)

const productRepository = ProductRepository.getInstance()
export const ProductsUseCases = new ProductUseCase(productRepository)

const promotionRepository = PromotionRepository.getInstance()
export const PromotionsUseCases = new PromotionUseCase(promotionRepository)

export { CartLinkEntity } from './domain/entities/cartLinks'
export { CartEntity } from './domain/entities/carts'
export { OrderEntity } from './domain/entities/orders'
export { EmbeddedProduct, ProductEntity } from './domain/entities/products'
export { PromotionEntity } from './domain/entities/promotions'
export {
	AddToCartInput,
	CartProductItem,
	OrderDispatchDeliveryType,
	OrderFee,
	OrderPayment,
	OrderStatus,
	OrderType,
	ProductAddOns,
	ProductMeta,
	PromotionType,
} from './domain/types'
export * from './utils'
export { resolvePacks } from './utils/carts'
