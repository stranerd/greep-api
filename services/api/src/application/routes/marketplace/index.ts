import { groupRoutes } from 'equipped'
import { cartsRoutes } from './carts'
import { categoriesRoutes } from './categories'
import { ordersRoutes } from './orders'
import { productsRoutes } from './products'

export const marketplaceRoutes = groupRoutes('/marketplace', [...cartsRoutes, ...categoriesRoutes, ...ordersRoutes, ...productsRoutes])
