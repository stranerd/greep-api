import { Currencies } from '../domain/types'

// TODO: Add implementation to get rate from aboki and doviz
// All rates are relative to TRY, 1 currencu = x TRY
export const Rates: Record<Currencies, () => Promise<number>> = {
	[Currencies.TRY]: async () => 1,
	[Currencies.NGN]: async () => 1 / 27.5,
}
