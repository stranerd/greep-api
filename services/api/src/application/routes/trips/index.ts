import { groupRoutes } from 'equipped'
import transactions from './transactions'
import { tripsRoutes } from './trips'

export const tripRoutes = groupRoutes({ path: '/trips', groups: ['Trips'] }, [...transactions.routes, ...tripsRoutes])
