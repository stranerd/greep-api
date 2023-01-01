import { isClient } from '@utils/environment'

export const storage = {
	get: async (key: string) => {
		if (!isClient()) return
		const value = localStorage.getItem(key)
		return JSON.parse(value as string)
	},
	set: async (key: string, value: any) => {
		if (!isClient()) return
		localStorage.setItem(key, JSON.stringify(value))
	},
	remove: async (key: string) => {
		if (!isClient()) return
		localStorage.removeItem(key)
	}
}
