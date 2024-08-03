import { Router } from 'equipped'
import cartLinks from './cartLinks'
import carts from './carts'
import checkout from './checkout'
import offers from './offers'
import orders from './orders'
import products from './products'

const router = new Router({ path: '/marketplace', groups: ['Marketplace'] })
router.nest(checkout, carts, cartLinks, offers, orders, products)

export default router
