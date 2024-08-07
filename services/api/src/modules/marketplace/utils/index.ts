import { mergeWithUsers } from '@modules/users'
import { CartLinkEntity } from '../domain/entities/cartLinks'
import { CartEntity } from '../domain/entities/carts'
import { OrderEntity } from '../domain/entities/orders'
import { mergeWithProducts } from './products'

export const mergeOrdersData = async (orders: OrderEntity[]) =>
	await mergeWithUsers(orders, (e) => e.getMembers()).then((res) => mergeWithProducts(res, (e) => e.getProductIds()))

export const mergeCartsData = async (carts: CartEntity[]) => mergeWithProducts(carts, (e) => e.getProductIds())
export const mergeCartLinksData = async (cartLinks: CartLinkEntity[]) => mergeWithProducts(cartLinks, (e) => e.getProductIds())
