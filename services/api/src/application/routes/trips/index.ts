import { groupRoutes } from 'equipped'
import { transactionsRoutes } from './transactions'
import { tripsRoutes } from './trips'

export const tripRoutes = groupRoutes({ path: '/trips', tags: ['Trips'] }, [...transactionsRoutes, ...tripsRoutes])
