import { Schema } from 'equipped'

export type Location = {
	coords: [number, number]
	location: string
	description: string
}

export const LocationSchema = () =>
	Schema.object({
		coords: Schema.tuple([Schema.number(), Schema.number()]), //.nullable().default(null),
		location: Schema.string().min(1),
		description: Schema.string().min(1),
	})

export type Time = [number, number]

export const TimeSchema = () => Schema.tuple([Schema.number().int().gte(0).lte(23), Schema.number().int().gte(0).lte(59)])

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
