import { DeleteUsers, GetUsers } from '@modules/auth'

export const deleteUnverifiedUsers = async () => {
	const unverifiedUsers = await getUnverifiedUsers()
	const sevenDays = 7 * 24 * 60 * 60 * 1000
	const olderUsers = unverifiedUsers.filter((u) => u.signedUpAt <= (Date.now() - sevenDays))
	await DeleteUsers.execute(olderUsers.map((u) => u.id))
}

const getUnverifiedUsers = async () => {
	const { results: users } = await GetUsers.execute({
		where: [{ field: 'isVerified', value: false }],
		all: true
	})
	return users
}