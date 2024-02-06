import { UploadsController } from '@application/controllers/uploads'
import { StatusCodes, groupRoutes, makeController } from 'equipped'

export const categoriesRoutes = groupRoutes('/uploads', [
	{
		path: '/',
		method: 'post',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UploadsController.upload(req),
				}
			}),
		],
	},
])
