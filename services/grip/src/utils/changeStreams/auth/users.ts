import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { UserEntity, UserFromModel } from '@modules/auth'
import { DeleteUserTokens } from '@modules/push'

export const UserChangeStreamCallbacks: ChangeStreamCallbacks<UserFromModel, UserEntity> = {
	deleted: async ({ before }) => {
		await DeleteUserTokens.execute(before.id)
	}
}