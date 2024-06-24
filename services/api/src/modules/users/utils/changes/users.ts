import { AuthUsersUseCases } from '@modules/auth'
import { CommentsUseCases, LikesUseCases, ReportsUseCases, ReviewsUseCases, ViewsUseCases } from '@modules/interactions'
import { ProductsUseCases } from '@modules/marketplace'
import { NotificationType, sendNotification } from '@modules/notifications'
import { appInstance } from '@utils/environment'
import { publishers } from '@utils/events'
import { AuthRole, DbChangeCallbacks, Validation } from 'equipped'
import { UserFromModel } from '../../data/models/users'
import { UserEntity } from '../../domain/entities/users'

export const UserDbChangeCallbacks: DbChangeCallbacks<UserFromModel, UserEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(
			['', `/${after.id}`].map((c) => `users/users${c}`),
			after,
		)
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated(
			['', `/${after.id}`].map((c) => `users/users${c}`),
			after,
		)
		const updatedBioOrRoles = !!changes.bio || !!changes.roles || !!changes.type
		if (updatedBioOrRoles)
			await Promise.all(
				[ProductsUseCases, CommentsUseCases, LikesUseCases, ReportsUseCases, ReviewsUseCases, ViewsUseCases].map(
					async (useCase) => await useCase.updateUserBio(after.getEmbedded()),
				),
			)

		if (changes.account?.application && !before.account.application && after.account.application) {
			const { accepted, message } = after.account.application
			if (accepted)
				await AuthUsersUseCases.updateRole({
					userId: after.id,
					roles: {
						[AuthRole.isDriver]: after.isDriver(),
						[AuthRole.isVendor]: after.isVendor(),
						[AuthRole.isVendorFoods]: after.isVendorFoods(),
						[AuthRole.isVendorItems]: after.isVendorItems(),
					},
				})
			await sendNotification([after.id], {
				title: `Account Application ${accepted ? 'Accepted' : 'Rejected'}`,
				body: `Your account application was ${accepted ? 'accepted' : 'rejected'}.${message ? message : ''}`,
				sendEmail: true,
				data: { type: NotificationType.AccountApplication, accepted, message },
			})
		}

		if (before.type && changes.type && !Validation.isBoolean()(changes.type)) {
			if ('license' in changes.type && 'license' in before.type) await publishers.DELETEFILE.publish(before.type.license)
			if ('banner' in changes.type && 'banner' in before.type && before.type.banner)
				await publishers.DELETEFILE.publish(before.type.banner)
			if ('passport' in changes.type && 'passport' in before.type && before.type.passport)
				await publishers.DELETEFILE.publish(before.type.passport)
			if ('studentId' in changes.type && 'studentId' in before.type && before.type.studentId)
				await publishers.DELETEFILE.publish(before.type.studentId)
			if ('residentPermit' in changes.type && 'residentPermit' in before.type && before.type.residentPermit)
				await publishers.DELETEFILE.publish(before.type.residentPermit)
		}
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(
			['', `/${before.id}`].map((c) => `users/users${c}`),
			before,
		)

		if (before.type) {
			if ('license' in before.type) await publishers.DELETEFILE.publish(before.type.license)
			if ('banner' in before.type && before.type.banner) await publishers.DELETEFILE.publish(before.type.banner)
			if ('passport' in before.type && before.type.passport) await publishers.DELETEFILE.publish(before.type.passport)
			if ('studentId' in before.type && before.type.studentId) await publishers.DELETEFILE.publish(before.type.studentId)
			if ('residentPermit' in before.type && before.type.residentPermit)
				await publishers.DELETEFILE.publish(before.type.residentPermit)
		}
	},
}
