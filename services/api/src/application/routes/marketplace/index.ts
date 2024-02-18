import { groupRoutes } from 'equipped'
import { cartsRoutes } from './carts'
import { ordersRoutes } from './orders'
import { productsRoutes } from './products'

export const marketplaceRoutes = groupRoutes('/marketplace', [...cartsRoutes, ...ordersRoutes, ...productsRoutes])
