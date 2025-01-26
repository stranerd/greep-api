import { Schema, Validation } from 'equipped'

export type LocationInput = {
	coords: [number, number]
	location: string
	description: string
}

export type Location = LocationInput & {
	hash: string
}

export const LocationSchema = () =>
	Schema.object({
		coords: Schema.tuple([Schema.number(), Schema.number()]),
		location: Schema.string().min(1),
		description: Schema.string().min(1),
	}).transform((data) => ({
		...data,
		hash: Validation.Geohash.encode(data.coords),
	}))

export const getCoordsHashSlice = (hash: string, radiusInM: number) => {
	if (radiusInM < 0) return hash.slice(0, 11)
	if (radiusInM < 1) return hash.slice(0, 10)
	if (radiusInM < 5) return hash.slice(0, 9)
	if (radiusInM < 40) return hash.slice(0, 8)
	if (radiusInM < 150) return hash.slice(0, 7)
	if (radiusInM < 1_200) return hash.slice(0, 6)
	if (radiusInM < 5_000) return hash.slice(0, 5)
	if (radiusInM < 40_000) return hash.slice(0, 4)
	if (radiusInM < 160_000) return hash.slice(0, 3)
	if (radiusInM < 1_200_000) return hash.slice(0, 2)
	return hash
}

export type Time = { hr: number; min: number }

export const TimeSchema = () =>
	Schema.object({
		hr: Schema.number().int().gte(0).lte(23),
		min: Schema.number().int().gte(0).lte(59),
	})

export type Ratings = {
	total: number
	count: number
	avg: number
	distribution: Record<number, number>
}

const NumberSchema = {
	type: Number,
	required: false,
	default: 0,
}

export const RatingsSchema = {
	total: NumberSchema,
	avg: NumberSchema,
	count: NumberSchema,
	distribution: Object.fromEntries([1, 2, 3, 4, 5].map((i) => [i.toString(), NumberSchema])),
}

export const updateRatings = (ratings: Ratings, rating: number, add: boolean) => {
	const update = {
		...ratings,
		distribution: { ...ratings.distribution },
	}
	update.count += add ? 1 : -1
	update.distribution[rating] += add ? 1 : -1
	if (update.distribution[rating] < 0) update.distribution[rating] = 0
	update.total += (add ? 1 : -1) * rating
	update.avg = Number((update.total / update.count).toFixed(2))
	return update
}

export type Tz = {
	id: string
	name: string
	offset: string
}

export const timezones = Intl.supportedValuesOf('timeZone').map((timeZone): Tz => {
	const offset = new Intl.DateTimeFormat('en', { timeZone, timeZoneName: 'shortOffset' })
		.formatToParts()
		.find((part) => part.type === 'timeZoneName')!.value
	const name = new Intl.DateTimeFormat('en', { timeZone, timeZoneName: 'long' })
		.formatToParts()
		.find((part) => part.type === 'timeZoneName')!.value

	return {
		id: timeZone,
		name,
		offset,
	}
})
