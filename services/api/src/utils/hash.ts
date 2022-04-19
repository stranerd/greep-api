import * as bcrypt from 'bcryptjs'
import { Instance, StorageFile, Validation } from '@stranerd/api-commons'

export const hash = async (password: string) => {
	const saltRounds = 10
	if (!password) return ''
	return await bcrypt.hash(password.trim(), saltRounds)
}

export const hashCompare = async (password: string, hashed: string) => {
	if (!password && password === hashed) return true
	return await bcrypt.compare(password.trim(), hashed)
}

export const isNotTruncated = (file?: StorageFile) => {
	const valid = file ? !file.isTruncated : true
	if (valid) return Validation.isValid()
	return Validation.isInvalid(`is larger than allowed limit of ${Instance.getInstance().settings.maxFileUploadSizeInMb}mb`)
}