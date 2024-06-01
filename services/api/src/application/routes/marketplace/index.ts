import { Router } from 'equipped'
import carts from './carts'
import { ordersRoutes } from './orders'
import products from './products'

const router = new Router({ path: '/marketplace', groups: ['Marketplace'] })
router.nest(carts, products)
router.add(...ordersRoutes)

export default router
