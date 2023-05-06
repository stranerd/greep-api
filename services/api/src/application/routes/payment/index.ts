import { Route } from 'equipped'
import { transactionsRoutes } from './transactions'
import { walletsRoutes } from './wallets'

export const paymentRoutes: Route[] = [
	...transactionsRoutes,
	...walletsRoutes
]