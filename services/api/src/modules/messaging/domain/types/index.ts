import { MediaOutput } from 'equipped'

export type Media = MediaOutput

export enum ChatType {
	personal = 'personal',
	support = 'support',
}

export type ChatData =
	| {
			type: ChatType.personal
			members: string[]
	  }
	| {
			type: ChatType.support
			members: string[]
	  }

export enum ChatSupportType {
	orders = 'orders',
}

export type ChatMetaData =
	| {
			type: ChatType.personal
	  }
	| {
			type: ChatType.support
			sub: { type: ChatSupportType.orders; orderId: string }
	  }
