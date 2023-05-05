import { Route } from 'equipped'
import { methodsRoutes } from './methods'
import { transactionsRoutes } from './transactions'
import { walletsRoutes } from './wallets'

export const paymentRoutes: Route[] = [
	...transactionsRoutes,
	...methodsRoutes,
	...walletsRoutes
]