import * as bcrypt from 'bcryptjs'

export const hash = async (password: string) => {
	const saltRounds = 10
	if (!password) return ''
	return await bcrypt.hash(password.trim(), saltRounds)
}

export const hashCompare = async (password: string, hashed: string) => {
	if (!password && password === hashed) return true
	return await bcrypt.compare(password.trim(), hashed)
}