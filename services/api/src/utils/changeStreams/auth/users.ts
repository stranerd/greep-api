import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { UserEntity, UserFromModel } from '@modules/auth'
import { CreateReferral, CreateUserWithBio, UpdateUserWithBio, UpdateUserWithRoles } from '@modules/users'
import { EventTypes, publishers } from '@utils/events'

export const UserChangeStreamCallbacks: ChangeStreamCallbacks<UserFromModel, UserEntity> = {
	created: async ({ after }) => {
		await CreateUserWithBio.execute({
			id: after.id,
			data: {
				firstName: after.firstName,
				lastName: after.lastName,
				fullName: after.fullName,
				email: after.email,
				description: after.description,
				photo: after.photo,
				coverPhoto: after.coverPhoto
			},
			timestamp: after.signedUpAt
		})
		await UpdateUserWithRoles.execute({
			id: after.id,
			data: after.roles,
			timestamp: Date.now()
		})
		if (after.referrer) await CreateReferral.execute({
			userId: after.referrer,
			referred: after.id
		})
	},
	updated: async ({ before, after, changes }) => {
		if (changes.photo && before.photo) await publishers[EventTypes.DELETEFILE].publish(before.photo)
		if (changes.coverPhoto && before.coverPhoto) await publishers[EventTypes.DELETEFILE].publish(before.coverPhoto)

		const updatedBio = changes.firstName || changes.lastName || changes.photo || changes.email || changes.description || changes.coverPhoto

		if (updatedBio) await UpdateUserWithBio.execute({
			id: after.id,
			data: {
				firstName: after.firstName,
				lastName: after.lastName,
				fullName: after.fullName,
				email: after.email,
				description: after.description,
				photo: after.photo,
				coverPhoto: after.coverPhoto
			},
			timestamp: Date.now()
		})

		const updatedRoles = changes.roles
		if (updatedRoles) await UpdateUserWithRoles.execute({
			id: after.id,
			data: after.roles,
			timestamp: Date.now()
		})

		if (changes.referrer && after.referrer) await CreateReferral.execute({
			userId: after.referrer,
			referred: after.id
		})
	},
	deleted: async ({ before }) => {
		if (before.photo) await publishers[EventTypes.DELETEFILE].publish(before.photo)
		if (before.coverPhoto) await publishers[EventTypes.DELETEFILE].publish(before.coverPhoto)
	}
}