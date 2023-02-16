import { isEqualTo, isMaxOf, isMinOf, isString } from 'valleyed'
import { PasswordUpdate } from '../entities/auth'
import { BaseFactory } from '@modules/core'

type Keys = { oldPassword: string, password: string, cPassword: string }

export class PasswordUpdateFactory extends BaseFactory<null, PasswordUpdate, Keys> {
	readonly rules = {
		oldPassword: { required: true, rules: [isString()] },
		password: {
			required: true,
			rules: [isString(), isMinOf(8), isMaxOf(16)]
		},
		cPassword: {
			required: true,
			rules: [
				isString(),
				(val: unknown) => isEqualTo(this.password, (val, comp) => val === comp, 'is not equal')(val),
				isMinOf(8), isMaxOf(18)]
		}
	}

	reserved = []

	constructor () {
		super({ oldPassword: '', password: '', cPassword: '' })
	}

	get oldPassword () {
		return this.values.oldPassword!
	}

	set oldPassword (value: string) {
		this.set('oldPassword', value)
		this.set('password', this.password)
		this.set('cPassword', this.cPassword)
	}

	get password () {
		return this.values.password!
	}

	set password (value: string) {
		this.set('password', value)
		this.set('cPassword', this.cPassword)
	}

	get cPassword () {
		return this.values.cPassword!
	}

	set cPassword (value: string) {
		if (value || this.password) this.set('cPassword', value)
		else {
			this.values.cPassword = this.defaults.cPassword
			this.validValues.cPassword = this.defaults.cPassword
			this.errors.cPassword = ''
		}
	}

	toModel = async () => {
		if (this.valid) {
			const { oldPassword, password } = this.validValues
			return { oldPassword, password }
		} else throw new Error('Validation errors')
	}

	loadEntity = (entity: null) => {
		throw new Error(`Cannot load an entity into this factory, ${entity}`)
	}
}
