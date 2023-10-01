import { groupRoutes } from 'equipped'
import { transactionsRoutes } from './transactions'
import { walletsRoutes } from './wallets'
import { withdrawalsRoutes } from './withdrawals'

export const paymentRoutes = groupRoutes('/payment', [
	...transactionsRoutes,
	...walletsRoutes,
	...withdrawalsRoutes
])