import { generateJSONSchema } from 'equipped'
import fs from 'fs'
import * as path from 'path'

try {
	console.log('Starting schema generation')

	const entry = path.resolve(__dirname, '../src/application')
	const outputFile = path.join(entry, `schema.json`)
	const routesEntry = path.join(entry, 'routes')

	const routesFiles = fs
		.readdirSync(routesEntry, { recursive: true })
		.filter((file) => file.toString().endsWith('.ts'))
		.map((file) => path.join(routesEntry, file.toString()))

	const jsonSchema = generateJSONSchema([/RouteDef$/], routesFiles, {
		tsConfigPath: path.resolve(__dirname, '../tsconfig.json'),
		options: {
			ignoreErrors: true,
		},
	})

	fs.mkdirSync(path.dirname(outputFile), { recursive: true })
	fs.writeFileSync(outputFile, JSON.stringify(jsonSchema, null, 4))

	console.log('Generated schema successfully')
} catch (error) {
	console.error('Failed to generate schema: ', error)
}
