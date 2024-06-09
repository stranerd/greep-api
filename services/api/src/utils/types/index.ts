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
