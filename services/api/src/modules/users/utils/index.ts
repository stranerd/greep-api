import { UsersUseCases } from '@modules/users'
import { BaseEntity, Conditions } from 'equipped'

export const mergeWithUsers = async <T extends BaseEntity<any, any>>(entities: T[], getUsers: (e: T) => string[]) => {
	const userIds = [...new Set(entities.flatMap((e) => getUsers(e)))]
	const { results: users } = await UsersUseCases.get({ where: [{ field: 'id', condition: Conditions.in, value: userIds }] })
	const usersMap = new Map(users.map((u) => [u.id, u.getEmbedded()]))
	return entities.map((e) => {
		const users = getUsers(e).map((id) => usersMap.get(id)!)
		return { ...e, users }
	})
}
