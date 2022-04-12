import {
	BadRequestError,
	deleteCachedAccessToken,
	deleteCachedRefreshToken,
	exchangeOldForNewTokens,
	makeAccessToken,
	makeRefreshToken
} from '@stranerd/api-commons'
import { AuthOutput, FindUser, UserEntity } from '@modules/auth'

export const signOutUser = async (userId: string): Promise<boolean> => {
	await deleteCachedAccessToken(userId)
	await deleteCachedRefreshToken(userId)
	return true
}

export const generateAuthOutput = async (user: UserEntity): Promise<AuthOutput & { user: UserEntity }> => {
	const accessToken = await makeAccessToken({
		id: user.id,
		roles: user.roles,
		isVerified: user.isVerified,
		authTypes: user.authTypes
	})
	const refreshToken = await makeRefreshToken({ id: user.id })
	return { accessToken, refreshToken, user }
}

export const getNewTokens = async (tokens: AuthOutput): Promise<AuthOutput & { user: UserEntity }> => {
	let user = null as any
	const newTokens = await exchangeOldForNewTokens(tokens, async (id: string) => {
		user = await FindUser.execute(id)
		if (!user) throw new BadRequestError('No account with such id exists')

		return {
			id: user.id,
			roles: user.roles,
			isVerified: user.isVerified,
			authTypes: user.authTypes
		}
	})

	return { ...newTokens, user }
}