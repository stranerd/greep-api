import { Currencies } from '../domain/types'

// TODO: Add implementation to get rate from aboki and doviz
export const Rates = {
	[Currencies.TRY]: async () => 1,
	[Currencies.NGN]: async () => 1 / 27.5,
}
