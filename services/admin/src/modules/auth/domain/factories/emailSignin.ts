import { isEmail, isMaxOf, isMinOf, isString } from 'valleyed'
import { AuthUser } from '../entities/auth'
import { BaseFactory } from '@modules/core'

type Keys = { email: string, password: string }

export class EmailSigninFactory extends BaseFactory<null, AuthUser, Keys> {
	readonly rules = {
		email: { required: true, rules: [isEmail()] },
		password: { required: true, rules: [isString(), isMinOf(8), isMaxOf(16)] }
	}

	reserved = []

	constructor () {
		super({ email: '', password: '' })
	}

	get email () {
		return this.values.email
	}

	set email (value: string) {
		this.set('email', value)
	}

	get password () {
		return this.values.password
	}

	set password (value: string) {
		this.set('password', value)
	}

	toModel = async () => {
		if (this.valid) {
			const { email, password } = this.validValues
			return { email, password }
		} else throw new Error('Validation errors')
	}

	loadEntity = (entity: null) => {
		throw new Error(`Cannot load an entity into this factory, ${entity}`)
	}
}
