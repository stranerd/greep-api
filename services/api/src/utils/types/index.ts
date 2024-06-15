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
}

export type Likes = Record<string, boolean>

type Tz = {
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
