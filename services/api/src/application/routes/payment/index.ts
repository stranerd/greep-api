import { Router } from 'equipped'
import { requestsRoutes } from './requests'
import { transactionsRoutes } from './transactions'
import { walletsRoutes } from './wallets'
import { withdrawalsRoutes } from './withdrawals'

const router = new Router({ path: '/payment', groups: ['Payment'] })
router.add(...transactionsRoutes, ...requestsRoutes, ...walletsRoutes, ...withdrawalsRoutes)

export default router
