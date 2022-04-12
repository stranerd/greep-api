import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { TokenEntity, TokenFromModel } from '@modules/push'

export const TokenChangeStreamCallbacks: ChangeStreamCallbacks<TokenFromModel, TokenEntity> = {}