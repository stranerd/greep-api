import { Router } from 'equipped'
import requests from './requests'
import transactions from './transactions'
import wallets from './wallets'
import withdrawals from './withdrawals'

const router = new Router({ path: '/payment', groups: ['Payment'] })
router.nest(requests, transactions, wallets, withdrawals)

export default router
