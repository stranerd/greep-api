import { AuthRepository } from './data/repositories/auth'
import { UserRepository } from './data/repositories/users'
import { AuthenticateUserUseCase } from './domain/useCases/auth/authenticateUser'
import { GoogleSignInUseCase } from './domain/useCases/auth/googleSignIn'
import { RegisterUserUseCase } from './domain/useCases/auth/registerUser'
import { ResetPasswordUseCase } from './domain/useCases/auth/resetPassword'
import { SendPasswordResetMailUseCase } from './domain/useCases/auth/sendPasswordResetMail'
import { SendVerificationEmailUseCase } from './domain/useCases/auth/sendVerificationEmail'
import { VerifyEmailUseCase } from './domain/useCases/auth/verifyEmail'
import { FindUserUseCase } from './domain/useCases/user/findUser'
import { UpdatePasswordUseCase } from './domain/useCases/user/updatePassword'
import { FindUserByEmailUseCase } from './domain/useCases/user/findUserByEmail'
import { GetUsersUseCase } from './domain/useCases/user/getUsers'
import { DeleteUsersUseCase } from './domain/useCases/user/deleteUsers'
import { UpdateUserDetailsUseCase } from './domain/useCases/user/updateUserDetails'
import { UpdateUserProfileUseCase } from './domain/useCases/user/updateUserProfile'
import { UpdateUserRoleUseCase } from './domain/useCases/user/updateUserRole'

const authRepository = AuthRepository.getInstance()
const userRepository = UserRepository.getInstance()

export const AuthenticateUser = new AuthenticateUserUseCase(authRepository)
export const GoogleSignIn = new GoogleSignInUseCase(authRepository)
export const RegisterUser = new RegisterUserUseCase(authRepository)
export const ResetPassword = new ResetPasswordUseCase(authRepository)
export const SendPasswordResetMail = new SendPasswordResetMailUseCase(authRepository)
export const SendVerificationEmail = new SendVerificationEmailUseCase(authRepository)
export const VerifyEmail = new VerifyEmailUseCase(authRepository)

export const FindUser = new FindUserUseCase(userRepository)
export const UpdatePassword = new UpdatePasswordUseCase(userRepository)
export const FindUserByEmail = new FindUserByEmailUseCase(userRepository)
export const GetUsers = new GetUsersUseCase(userRepository)
export const DeleteUsers = new DeleteUsersUseCase(userRepository)
export const UpdateUserDetails = new UpdateUserDetailsUseCase(userRepository)
export const UpdateUserProfile = new UpdateUserProfileUseCase(userRepository)
export const UpdateUserRole = new UpdateUserRoleUseCase(userRepository)

export { UserEntity } from './domain/entities/users'
export { UserFromModel } from './data/models/users'
export { AuthOutput } from './domain/types'