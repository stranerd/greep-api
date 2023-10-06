import { AuthUsersUseCases } from '@modules/auth'
import { NotificationType, sendNotification } from '@modules/notifications'
import { appInstance } from '@utils/environment'
import { publishers } from '@utils/events'
import { AuthRole, DbChangeCallbacks } from 'equipped'
import { UserFromModel } from '../../data/models/users'
import { UserEntity } from '../../domain/entities/users'

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
			if (accepted) await AuthUsersUseCases.updateRole({ userId: after.id, roles: { [AuthRole.isActive]: accepted }})
			await sendNotification([after.id], {
				title: `Account Application ${accepted ? 'Accepted' : 'Rejected'}`,
				body: `Your account application was ${accepted ? 'accepted' : 'rejected'}.${message ? message : ''}`,
				sendEmail: true,
				data: { type: NotificationType.AccountApplication, accepted, message }
			})
		}

		if (changes.type && 'license' in changes.type && 'license' in before.type) await publishers.DELETEFILE.publish(before.type.license)
		if (changes.type && 'passport' in changes.type && 'passport' in before.type) await publishers.DELETEFILE.publish(before.type.passport)
		if (changes.type && 'studentId' in changes.type && 'studentId' in before.type) await publishers.DELETEFILE.publish(before.type.studentId)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted([
			'', `/${before.id}`
		].map((c) => `users/users${c}`), before)

		if ('license' in before.type) await publishers.DELETEFILE.publish(before.type.license)
		if ('passport' in before.type) await publishers.DELETEFILE.publish(before.type.passport)
		if ('studentId' in before.type) await publishers.DELETEFILE.publish(before.type.studentId)
	}
}