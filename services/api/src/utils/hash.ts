import * as bcrypt from 'bcryptjs'
import { MediaOutput, Validation } from '@stranerd/api-commons'

export const hash = async (password: string) => {
	const saltRounds = 10
	if (!password) return ''
	return await bcrypt.hash(password.trim(), saltRounds)
}

export const hashCompare = async (password: string, hashed: string) => {
	if (!password && password === hashed) return true
	return await bcrypt.compare(password.trim(), hashed)
}

export const isMedia = (file: MediaOutput) => {
	const valids = [
		Validation.isString(file?.name),
		Validation.isString(file?.type),
		Validation.isNumber(file?.size),
		Validation.isNumber(file?.timestamp),
		Validation.isString(file?.path),
		Validation.isString(file?.link),
		Validation.hasMoreThan(Validation.extractUrls(file?.link ?? ''), 0)
	]
	if (valids.every((v) => v)) return Validation.isValid()
	return Validation.isInvalid('is not a valid file output from our servers')
}