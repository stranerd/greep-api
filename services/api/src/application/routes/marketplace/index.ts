import { Router } from 'equipped'
import cartLinks from './cartLinks'
import carts from './carts'
import checkout from './checkout'
import orders from './orders'
import products from './products'
import promotions from './promotions'

const router = new Router({ path: '/marketplace', groups: ['Marketplace'] })
router.nest(checkout, carts, cartLinks, orders, products, promotions)

export default router
