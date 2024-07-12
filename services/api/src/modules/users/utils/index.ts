import { UsersUseCases } from '@modules/users'
import { BaseEntity, Conditions } from 'equipped'
import { BusinessTime, EmbeddedUser } from '../domain/types'

export const mergeWithUsers = async <T extends BaseEntity<any, any>>(entities: T[], getUsers: (e: T) => string[]) => {
	const userIds = [...new Set(entities.flatMap((e) => getUsers(e)))]
	const { results: users } = await UsersUseCases.get({ where: [{ field: 'id', condition: Conditions.in, value: userIds }] })
	const usersMap = new Map(users.map((u) => [u.id, u.getEmbedded()]))
	return entities.map((e) => {
		const users = getUsers(e).map((id) => usersMap.get(id)!)
		// @ts-ignore
		e.users = users
		return e as T & { users: EmbeddedUser[] }
	})
}

export const isVendorOpen = (time: BusinessTime) => {
	if (!time) return false
	const nowAtTimezone = new Date(new Date().toLocaleString('en-US', { timeZone: time.timezone }))
	const timeSlot = time.schedule[(nowAtTimezone.getDay() + 6) % 7] // schedule starts from monday not sunday
	if (!timeSlot) return false
	const { from, to } = timeSlot
	const hour = nowAtTimezone.getHours()
	const minute = nowAtTimezone.getMinutes()
	return [hour >= from[0], hour <= to[0], minute >= from[1], minute <= to[1]].every(Boolean)
}
