import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { UserEntity, UserFromModel } from '@modules/auth'
import { ReferralsUseCases, UsersUseCases } from '@modules/users'
import { EventTypes, publishers } from '@utils/events'

export const UserChangeStreamCallbacks: ChangeStreamCallbacks<UserFromModel, UserEntity> = {
	created: async ({ after }) => {
		await UsersUseCases.createUserWithBio({
			id: after.id,
			data: {
				name: after.allNames,
				email: after.email,
				description: after.description,
				photo: after.photo,
				coverPhoto: after.coverPhoto
			},
			timestamp: after.signedUpAt
		})
		await UsersUseCases.updateUserWithRoles({
			id: after.id,
			data: after.roles,
			timestamp: Date.now()
		})
		if (after.referrer) await ReferralsUseCases.createReferral({
			userId: after.referrer,
			referred: after.id
		})
	},
	updated: async ({ before, after, changes }) => {
		if (changes.photo && before.photo) await publishers[EventTypes.DELETEFILE].publish(before.photo)
		if (changes.coverPhoto && before.coverPhoto) await publishers[EventTypes.DELETEFILE].publish(before.coverPhoto)

		const updatedBio = UserEntity.bioKeys().some((key) => changes[key])
		if (updatedBio) await UsersUseCases.updateUserWithBio({
			id: after.id,
			data: {
				name: after.allNames,
				email: after.email,
				description: after.description,
				photo: after.photo,
				coverPhoto: after.coverPhoto
			},
			timestamp: Date.now()
		})

		const updatedRoles = changes.roles
		if (updatedRoles) await UsersUseCases.updateUserWithRoles({
			id: after.id,
			data: after.roles,
			timestamp: Date.now()
		})

		if (changes.referrer && after.referrer) await ReferralsUseCases.createReferral({
			userId: after.referrer,
			referred: after.id
		})
	},
	deleted: async ({ before }) => {
		if (before.photo) await publishers[EventTypes.DELETEFILE].publish(before.photo)
		if (before.coverPhoto) await publishers[EventTypes.DELETEFILE].publish(before.coverPhoto)
	}
}