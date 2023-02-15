import { isEmail, isMaxOf, isMinOf, isShallowEqualTo, isString } from 'valleyed'
import { BaseFactory } from '@modules/core'

type Keys = { email: string, token: string, password: string, cPassword: string }

export class PasswordResetFactory extends BaseFactory<null, { password: string, token: string }, Keys> {
	readonly rules = {
		token: { required: true, rules: [isString(), isMinOf(5)] },
		password: { required: true, rules: [isString(), isMinOf(8), isMaxOf(16)] },
		cPassword: {
			required: true,
			rules: [
				isString(),
				(val: unknown) => isShallowEqualTo(this.password, 'is not equal to the new password')(val),
				isMinOf(8), isMaxOf(16)]
		},
		email: { required: true, rules: [isString(), isEmail()] }
	}

	reserved = []

	constructor () {
		super({ email: '', password: '', cPassword: '', token: '' })
	}

	get email () {
		return this.values.email
	}

	set email (value: string) {
		this.set('email', value)
	}

	get token () {
		return this.values.token
	}

	set token (value: string) {
		this.set('token', value)
	}

	get password () {
		return this.values.password
	}

	set password (value: string) {
		this.set('password', value)
		this.set('cPassword', this.cPassword)
	}

	get cPassword () {
		return this.values.cPassword!
	}

	set cPassword (value: string) {
		this.set('cPassword', value)
	}

	toModel = async () => {
		if (this.valid) {
			const { password, token } = this.validValues
			return { password, token }
		} else throw new Error('Validation errors')
	}

	loadEntity = (entity: null) => {
		throw new Error(`Cannot load an entity into this factory, ${entity}`)
	}
}
