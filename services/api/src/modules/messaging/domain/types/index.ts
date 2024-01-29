import { MediaOutput } from 'equipped'

export type Media = MediaOutput

export enum ChatType {
	personal = 'personal',
}

export type ChatData = {
	type: ChatType.personal
	members: string[]
}
