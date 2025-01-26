import { Router } from 'equipped'
import auth from './auth'
import interactions from './interactions'
import marketplace from './marketplace'
import messaging from './messaging'
import notifications from './notifications'
import payment from './payment'
import trips from './trips'
import users from './users'

export const router = new Router()
router.nest(auth, interactions, marketplace, messaging, notifications, payment, trips, users)
