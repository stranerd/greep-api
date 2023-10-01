import { groupRoutes } from 'equipped'
import { transactionsRoutes } from './transactions'
import { walletsRoutes } from './wallets'

export const paymentRoutes = groupRoutes('/payment', [
	...transactionsRoutes,
	...walletsRoutes
])