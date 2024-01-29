import { DbChangeCallbacks } from 'equipped'
import { TokenFromModel } from '../../data/models/tokens'
import { TokenEntity } from '../../domain/entities/tokens'

export const TokenDbChangeCallbacks: DbChangeCallbacks<TokenFromModel, TokenEntity> = {}
