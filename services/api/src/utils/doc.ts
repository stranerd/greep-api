import { createGenerator } from 'ts-json-schema-generator'
import jsDoc from 'swagger-jsdoc'
import fs from 'fs'
import { dirname } from 'path'

const outputFile = process.argv[2] ?? 'dist/doc.json'

const isObject = (item) => item && typeof item === 'object' && !Array.isArray(item)

const mergeDeep = (target, source) => {
	const output = Object.assign({}, target)
	if (isObject(target) && isObject(source)) {
		Object.keys(source).forEach((key) => {
			if (isObject(source[key])) {
				if (!(key in target)) Object.assign(output, { [key]: source[key] })
				else output[key] = mergeDeep(target[key], source[key])
			} else Object.assign(output, { [key]: source[key] })
		})
	}
	return output
}

const generateDataTypes = async () => {
	const config = {
		path: 'src/modules/*/domain/entities/*.ts',
		tsconfig: 'tsconfig.json',
		type: '*'
	}
	return createGenerator(config).createSchema(config.type)
}

const generateRoutes = async () => {
	return await jsDoc({
		definition: {
			swagger: '2.0',
			openapi: '3.0.0',
			info: {
				title: 'Greep',
				version: '1.0.0',
				description: 'The Greep API'
			}
		},
		apis: ['./src/application/doc/?(*)/*.yaml']
	})
}

export const generateDocs = async () => {
	const dataTypes = await generateDataTypes()
	const routes = await generateRoutes()
	const merged = mergeDeep(dataTypes, routes)

	const schemaString = JSON.stringify(merged, null, 4)

	const folder = dirname(outputFile)
	if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true })
	fs.writeFileSync(outputFile, schemaString)

	return merged
}

generateDocs().then()