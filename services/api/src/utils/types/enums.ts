import { makeEnum } from 'equipped'

const Ar = makeEnum('AuthRole', {
	isAdmin: 'isAdmin',
	isSuperAdmin: 'isSuperAdmin',
	isDriver: 'isDriver',
	isVendor: 'isVendor',
	isRestuarant: 'isRestuarant',
} as const)

const El = makeEnum('EmailsList', {
	NO_REPLY: 'no-reply@stranerd.com',
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
