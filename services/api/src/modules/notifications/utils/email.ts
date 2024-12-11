// import { appInstance, emails, isDev } from '@utils/environment'
// import { Email, EmailsList } from 'equipped'
// import { createTransport } from 'nodemailer'
// import path from 'path'
// import { EmailErrorsUseCases } from '../'

// const sendMail = async (email: Email) => {
// 	const { to, subject, content, from = EmailsList.NO_REPLY } = email
// 	const { clientId, privateKey } = emails[from]

// 	const transporter = createTransport({
// 		service: 'gmail',
// 		auth: { type: 'OAuth2', user: from, serviceClient: clientId, privateKey },
// 		tls: { rejectUnauthorized: false },
// 	})
// 	await transporter.verify()

// 	const attachments = [] as { filename: string; path: string; cid: string }[]

// 	attachments.push({
// 		filename: 'logo.png',
// 		path: path.join('emails/attachments/logo.png'),
// 		cid: 'logo',
// 	})

// 	await transporter.sendMail({
// 		from: `Stranerd ${from}`,
// 		html: content,
// 		to,
// 		subject,
// 		attachments,
// 	})
// }

// export const sendMailAndCatchError = async (email: Email) => {
// 	try {
// 		if (isDev) await appInstance.logger.info(email.to, email.content)
// 		await sendMail(email)
// 	} catch (e) {
// 		await EmailErrorsUseCases.add({
// 			...email,
// 			error: (e as Error).message,
// 		})
// 	}
// }

import sgMail from '@sendgrid/mail'
import fs from 'fs'
import path from 'path'
import { appInstance, sendGridApi, isDev } from '@utils/environment'
import { Email, EmailsList } from 'equipped'
import { EmailErrorsUseCases } from '../'

sgMail.setApiKey(sendGridApi)

const sendMail = async (email: Email) => {
	const { to, subject, content, from = EmailsList.NO_REPLY } = email

	const logoPath = path.join('emails/attachments/logo.png')
	const attachment = {
		filename: 'logo.png',
		type: 'image/png',
		disposition: 'inline',
		content_id: 'logo',
		content: fs.readFileSync(logoPath).toString('base64'),
	}

	const msg = {
		to,
		from: from,
		subject,
		html: content,
		attachments: [attachment],
	}

	await sgMail.send(msg)
}

export const sendMailAndCatchError = async (email: Email) => {
	try {
		if (isDev) await appInstance.logger.info(email.to, email.content)
		await sendMail(email)
	} catch (e) {
		await EmailErrorsUseCases.add({
			...email,
			error: (e as Error).message,
		})
	}
}
