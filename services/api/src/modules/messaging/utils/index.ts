import { UsersUseCases } from '@modules/users'
import { ChatMetaEntity } from '../domain/entities/chatMeta'

export const mergeChatMetasWithUserBios = async (chatMetas: ChatMetaEntity[]) => {
	const userIds = new Set(chatMetas.map((cm) => cm.members).flat())
	const { results: users } = await UsersUseCases.get({ where: [{ field: 'id', value: userIds }] })
	const usersMap = new Map(users.map((u) => [u.id, u.getEmbedded()]))
	return chatMetas.map((cm) => (
		cm.withUsers(
			Object.fromEntries([...cm.members].map((id) => [id, usersMap.get(id) ?? null]))
		))
	)
}