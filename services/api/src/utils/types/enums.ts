import { makeEnum } from 'equipped'

const Ar = makeEnum('AuthRole', {
	isAdmin: 'isAdmin',
	isSuperAdmin: 'isSuperAdmin'
} as const)

const El = makeEnum('EmailsList', {
	SUPPORT: 'support@greep.io',
} as const)

const Ev = makeEnum('EventTypes', {
	SENDMAIL: 'SENDMAIL',
	SENDTEXT: 'SENDTEXT',
	DELETEFILE: 'DELETEFILE'
} as const)

declare module 'equipped/lib/enums/types' {
	type TAr = typeof Ar
	type TEl = typeof El
	type TEv = typeof Ev
	interface IAuthRole extends TAr { }
	interface IEmailsList extends TEl { }
	interface IEventTypes extends TEv { }
}