import { makeEnum } from 'equipped'

const Ar = makeEnum('AuthRole', {
	isAdmin: 'isAdmin',
	isSuperAdmin: 'isSuperAdmin',
	isDriver: 'isDriver',
	isVendor: 'isVendor',
	isVendorFoods: 'isVendorFoods',
	isVendorItems: 'isVendorItems',
} as const)

const El = makeEnum('EmailsList', {
	NO_REPLY: 'admin@2gocash.com',
} as const)

const Ev = makeEnum('EventTypes', {
	SENDMAIL: 'SENDMAIL',
	SENDTEXT: 'SENDTEXT',
	DELETEFILE: 'DELETEFILE',
} as const)

declare module 'equipped/lib/enums/types' {
	type TAr = typeof Ar
	type TEl = typeof El
	type TEv = typeof Ev
	interface IAuthRole extends TAr {}
	interface IEmailsList extends TEl {}
	interface IEventTypes extends TEv {}
}
