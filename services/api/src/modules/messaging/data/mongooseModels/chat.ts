import { appInstance } from '@utils/environment'
import { ChatDbChangeCallbacks } from '../../utils/changes/chats'
import { ChatMapper } from '../mappers/chat'
import { ChatFromModel } from '../models/chat'

const Schema = new appInstance.dbs.mongo.Schema<ChatFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	from: {
		type: String,
		required: true
	},
	to: {
		type: String,
		required: true
	},
	body: {
		type: String,
		required: false,
		default: ''
	},
	links: {
		type: [appInstance.dbs.mongo.Schema.Types.Mixed] as unknown as ChatFromModel['links'],
		required: false,
		default: []
	},
	media: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: false,
		default: null
	},
	data: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true
	},
	readAt: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed as unknown as ChatFromModel['readAt'],
		required: false,
		default: {}
	},
	createdAt: {
		type: Number,
		required: false,
		default: Date.now
	},
	updatedAt: {
		type: Number,
		required: false,
		default: Date.now
	}
}, { timestamps: { currentTime: Date.now }, minimize: false })

export const Chat = appInstance.dbs.mongo.use().model('MessagingChat', Schema)

export const ChatChange = appInstance.dbs.mongo.change(Chat, ChatDbChangeCallbacks, new ChatMapper().mapFrom)