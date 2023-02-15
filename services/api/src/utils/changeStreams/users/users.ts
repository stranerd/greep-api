import { UserEntity, UserFromModel } from '@modules/users'
import { appInstance } from '@utils/environment'
import { ChangeStreamCallbacks } from 'equipped'

export const UserChangeStreamCallbacks: ChangeStreamCallbacks<UserFromModel, UserEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created('users/users', after)
		await appInstance.listener.created(`users/users/${after.id}`, after)
	},
	updated: async ({ after, changes }) => {
		await appInstance.listener.updated('users/users', after)
		await appInstance.listener.updated(`users/users/${after.id}`, after)
		const updatedBioOrRoles = !!changes.bio || !!changes.roles
		if (updatedBioOrRoles) await Promise.all([].map(async (useCase: any) => await useCase.updateUserBio(after.getEmbedded())))
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted('users/users', before)
		await appInstance.listener.deleted(`users/users/${before.id}`, before)
	}
}