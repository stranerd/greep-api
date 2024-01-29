import { CartRepository } from './data/repositories/cart'
import { CartUseCase } from './domain/useCases/cart'

const cartRepository = CartRepository.getInstance()
export const CartUseCases = new CartUseCase(cartRepository)

