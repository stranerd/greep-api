import { appInstance } from '@utils/environment'
import { ChatMetaDbChangeCallbacks } from '../../utils/changes/chatMetas'
import { ChatMetaMapper } from '../mappers/chatMeta'
import { ChatMetaFromModel } from '../models/chatMeta'

const Schema = new appInstance.dbs.mongo.Schema<ChatMetaFromModel>(
	{
		_id: {
			type: String,
			default: () => appInstance.dbs.mongo.Id.toString(),
		},
		readAt: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed as unknown as ChatMetaFromModel['readAt'],
			required: false,
			default: {},
		},
		last: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed as unknown as ChatMetaFromModel['last'],
			required: false,
			default: null as unknown as ChatMetaFromModel['last'],
		},
		members: {
			type: [String],
			required: true,
		},
		createdAt: {
			type: Number,
			required: false,
			default: Date.now,
		},
		updatedAt: {
			type: Number,
			required: false,
			default: Date.now,
		},
	},
	{ timestamps: { currentTime: Date.now }, minimize: false },
)

export const ChatMeta = appInstance.dbs.mongo.use().model('MessagingChatMeta', Schema)

export const ChatMetaChange = appInstance.dbs.mongo.change(ChatMeta, ChatMetaDbChangeCallbacks, new ChatMetaMapper().mapFrom)
