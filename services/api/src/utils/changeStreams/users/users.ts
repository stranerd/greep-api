import { UserEntity, UserFromModel } from '@modules/users'
import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'

export const UserDbChangeCallbacks: DbChangeCallbacks<UserFromModel, UserEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			'', `/${after.id}`
		].map((c) => `users/users${c}`), after)
	},
	updated: async ({ after, changes }) => {
		await appInstance.listener.updated([
			'', `/${after.id}`
		].map((c) => `users/users${c}`), after)
		const updatedBioOrRoles = !!changes.bio || !!changes.roles
		if (updatedBioOrRoles) await Promise.all([].map(async (useCase: any) => await useCase.updateUserBio(after.getEmbedded())))
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted([
			'', `/${before.id}`
		].map((c) => `users/users${c}`), before)
	}
}