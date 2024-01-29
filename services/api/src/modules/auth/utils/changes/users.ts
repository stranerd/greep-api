import { ReferralsUseCases, UsersUseCases } from '@modules/users'
import { publishers } from '@utils/events'
import { DbChangeCallbacks } from 'equipped'
import { UserFromModel } from '../../data/models/users'
import { AuthUserEntity } from '../../domain/entities/users'

export const UserDbChangeCallbacks: DbChangeCallbacks<UserFromModel, AuthUserEntity> = {
	created: async ({ after }) => {
		await UsersUseCases.createUserWithBio({
			id: after.id,
			data: {
				name: after.allNames,
				email: after.email,
				username: after.username,
				photo: after.photo,
				phone: after.phone,
			},
			timestamp: after.signedUpAt,
		})
		await UsersUseCases.updateUserWithRoles({
			id: after.id,
			data: after.roles,
			timestamp: Date.now(),
		})

		if (after.referrer && after.isVerified) await ReferralsUseCases.create({ userId: after.referrer, referred: after.id })
	},
	updated: async ({ before, after, changes }) => {
		if (changes.photo && before.photo) await publishers.DELETEFILE.publish(before.photo)

		const updatedBio = AuthUserEntity.bioKeys().some((key) => changes[key])
		if (updatedBio)
			await UsersUseCases.updateUserWithBio({
				id: after.id,
				data: {
					name: after.allNames,
					email: after.email,
					username: after.username,
					photo: after.photo,
					phone: after.phone,
				},
				timestamp: Date.now(),
			})

		const updatedRoles = changes.roles
		if (updatedRoles)
			await UsersUseCases.updateUserWithRoles({
				id: after.id,
				data: after.roles,
				timestamp: Date.now(),
			})

		if ((changes.referrer || changes.isVerified) && after.referrer && after.isVerified)
			await ReferralsUseCases.create({
				userId: after.referrer,
				referred: after.id,
			})
	},
	deleted: async ({ before }) => {
		await UsersUseCases.markUserAsDeleted({ id: before.id, timestamp: Date.now() })
		if (before.photo) await publishers.DELETEFILE.publish(before.photo)
	},
}
