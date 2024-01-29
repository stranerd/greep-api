import { groupRoutes } from 'equipped'
import { requestsRoutes } from './requests'
import { transactionsRoutes } from './transactions'
import { walletsRoutes } from './wallets'
import { withdrawalsRoutes } from './withdrawals'

export const paymentRoutes = groupRoutes('/payment', [...transactionsRoutes, ...requestsRoutes, ...walletsRoutes, ...withdrawalsRoutes])
