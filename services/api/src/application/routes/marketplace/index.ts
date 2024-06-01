import { Router } from 'equipped'
import { cartsRoutes } from './carts'
import { ordersRoutes } from './orders'
import { productsRoutes } from './products'

const router = new Router({ path: '/marketplace', groups: ['Marketplace'] })
router.add(...cartsRoutes, ...ordersRoutes, ...productsRoutes)

export default router
