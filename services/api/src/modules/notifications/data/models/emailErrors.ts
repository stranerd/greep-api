export interface EmailErrorFromModel extends EmailErrorToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface EmailErrorToModel {
	error: string,
	subject: string,
	to: string,
	content: string,
	from: string,
	data: {
		attachments?: Record<string, boolean>
	}
}