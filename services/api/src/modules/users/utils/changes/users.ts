import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { UserFromModel } from '../../data/models/users'
import { UserEntity } from '../../domain/entities/users'
import { NotificationType, sendNotification } from '@modules/notifications'

export const UserDbChangeCallbacks: DbChangeCallbacks<UserFromModel, UserEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			'', `/${after.id}`
		].map((c) => `users/users${c}`), after)
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated([
			'', `/${after.id}`
		].map((c) => `users/users${c}`), after)
		const updatedBioOrRoles = !!changes.bio || !!changes.roles
		if (updatedBioOrRoles) await Promise.all([].map(async (useCase: any) => await useCase.updateUserBio(after.getEmbedded())))

		if (changes.account?.application && !before.account.application && after.account.application) {
			const { accepted, message } = after.account.application
			await sendNotification([after.id], {
				title: `Account Application ${accepted ? 'Accepted' : 'Rejected'}`,
				body: `Your account application was ${accepted ? 'accepted' : 'rejected'}.${message ? message : ''}`,
				sendEmail: true,
				data: { type: NotificationType.AccountApplication, accepted, message }
			})
		}
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted([
			'', `/${before.id}`
		].map((c) => `users/users${c}`), before)
	}
}