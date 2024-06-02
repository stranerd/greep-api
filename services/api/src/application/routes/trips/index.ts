import { Router } from 'equipped'
import transactions from './transactions'
import trips from './trips'

const router = new Router({ path: '/trips', groups: ['Trips'] })
router.nest(transactions, trips)

export default router
