import { publishers } from '@utils/events'
import { ApiDef, EmailsList, readEmailFromPug, Router, Schema, validate } from 'equipped'

const router = new Router({ path: '/contact', groups: ['Contact'], middlewares: [] })

router.post<NotificationsContactSendRouteDef>({ path: '/', key: 'notifications-contact-send' })(async (req) => {
	const data = validate(
		{
			name: Schema.string().min(1),
			email: Schema.string().email(),
			company: Schema.string().min(1),
			subject: Schema.string().min(1),
			message: Schema.string().min(1),
		},
		req.body,
	)
	const content = await readEmailFromPug('emails/newFormMessage.pug', data)
	await publishers.SENDMAIL.publish({
		from: EmailsList.SUPPORT,
		to: 'support@greep.io', // TODO: change to contact email
		subject: `New Contact Message: ${data.subject}`,
		content,
		data: {},
	})
	return true
})

export default router

type NotificationsContactSendRouteDef = ApiDef<{
	key: 'notifications-contact-send'
	method: 'post'
	body: { name: string; email: string; company: string; subject: string; message: string }
	response: boolean
}>
