import { makeController, Route, StatusCodes, StorageFile, validate, Validation } from '@stranerd/api-commons'
import { StorageUseCases } from '@modules/storage'

const uploadFile: Route = {
	path: '/storage/file',
	method: 'post',
	controllers: [
		makeController(async (req) => {
			const file = req.files.file?.[0]
			const { path } = req.body
			const data = validate({ path, file }, {
				path: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
				file: {
					required: true, rules: [Validation.isFile, (_) => {
						if (file?.isTruncated) return Validation.isInvalid('is larger than allowed limit')
						else return Validation.isValid()
					}]
				}
			})
			const res = await StorageUseCases.upload(data.path, data.file)
			return {
				status: StatusCodes.Ok,
				result: res
			}
		})
	]
}

const uploadFiles: Route = {
	path: '/storage/files',
	method: 'post',
	controllers: [
		makeController(async (req) => {
			const files = req.files.file ?? []
			const data = validate({ path: req.body.path, files }, {
				path: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
				files: {
					required: true,
					rules: [
						Validation.isArrayOfX((cur: StorageFile) => Validation.isFile(cur).valid, 'files'),
						Validation.isArrayOfX((cur: StorageFile) => !cur?.isTruncated, 'less than the allowed limit')
					]
				}
			})
			const res = await Promise.all(
				data.files.map(async (f) => await StorageUseCases.upload(data.path, f))
			)
			return {
				status: StatusCodes.Ok,
				result: res
			}
		})
	]
}

const routes: Route[] = [uploadFile, uploadFiles]
export default routes