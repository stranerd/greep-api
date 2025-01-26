import { AuthTypes, Enum } from 'equipped'
import { UserToModel } from '../../data/models/users'
import { AuthUserEntity } from '../entities/users'
import { Credential, PasswordResetInput } from '../types'

export interface IAuthRepository {
	addNewUser(user: UserToModel, type: Enum<typeof AuthTypes>): Promise<AuthUserEntity>

	authenticateUser(details: Credential, passwordValidate: boolean, type: Enum<typeof AuthTypes>): Promise<AuthUserEntity>

	sendVerificationMail(email: string): Promise<boolean>

	verifyEmail(token: string): Promise<AuthUserEntity>

	sendPasswordResetMail(email: string): Promise<boolean>

	resetPassword(input: PasswordResetInput): Promise<AuthUserEntity>

	googleSignIn(tokenId: string, referrer: string | null): Promise<AuthUserEntity>

	appleSignIn(
		data: { idToken: string; email: string | null; firstName: string | null; lastName: string | null },
		referrer: string | null,
	): Promise<AuthUserEntity>
}
