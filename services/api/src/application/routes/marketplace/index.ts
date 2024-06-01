import { Router } from 'equipped'
import carts from './carts'
import orders from './orders'
import products from './products'

const router = new Router({ path: '/marketplace', groups: ['Marketplace'] })
router.nest(carts, orders, products)

export default router
