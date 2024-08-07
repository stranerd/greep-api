import { UsersUseCases } from '@modules/users'
import { BaseEntity, Conditions } from 'equipped'
import { BusinessTime, EmbeddedUser, UserVendorBusinessDays } from '../domain/types'

export const mergeWithUsers = async <T extends BaseEntity<{ users: Record<string, EmbeddedUser | null> }, any>>(
	entities: T[],
	getIds: (e: T) => string[],
) => {
	const ids = [...new Set(entities.flatMap((e) => getIds(e)))]
	const { results } = await UsersUseCases.get({ where: [{ field: 'id', condition: Conditions.in, value: ids }] })
	const map = new Map(results.map((u) => [u.id, u.getEmbedded()]))
	return entities.map((e) => {
		e.users = getIds(e).reduce(
			(acc, id) => {
				acc[id] = map.get(id) ?? null
				return acc
			},
			{} as Record<string, EmbeddedUser | null>,
		)
		return e
	})
}

const days = Object.values(UserVendorBusinessDays)

export const isVendorOpen = (time: BusinessTime) => {
	if (!time) return false
	const nowAtTimezone = new Date(new Date().toLocaleString('en-US', { timeZone: time.timezone }))
	const day = days[nowAtTimezone.getDay()]
	if (!day) return false
	const timeSlot = time.schedule[day]
	if (!timeSlot) return false
	const { from, to } = timeSlot
	const hour = nowAtTimezone.getHours()
	const minute = nowAtTimezone.getMinutes()
	return [hour >= from[0], hour <= to[0], minute >= from[1], minute <= to[1]].every(Boolean)
}
