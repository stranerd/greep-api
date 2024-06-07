import { Router } from 'equipped'
import cartLinks from './cartLinks'
import carts from './carts'
import orders from './orders'
import products from './products'

const router = new Router({ path: '/marketplace', groups: ['Marketplace'] })
router.nest(carts, cartLinks, orders, products)

export default router
