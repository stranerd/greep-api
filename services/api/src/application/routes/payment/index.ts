import { groupRoutes } from 'equipped'
import { requestsRoutes } from './requests'
import { transactionsRoutes } from './transactions'
import { walletsRoutes } from './wallets'
import { withdrawalsRoutes } from './withdrawals'

export const paymentRoutes = groupRoutes({ path: '/payment', groups: ['Payment'] }, [
	...transactionsRoutes,
	...requestsRoutes,
	...walletsRoutes,
	...withdrawalsRoutes,
])
