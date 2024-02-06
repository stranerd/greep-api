import { appInstance } from '@utils/environment'

export const mongoose = appInstance.dbs.mongo.use()
