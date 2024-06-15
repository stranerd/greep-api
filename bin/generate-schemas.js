const { generateJSONSchema } = require('equipped')
const fs = require('fs')
const { dirname, join, resolve } = require('path')

const paths = process.argv.slice(2)

paths.forEach((path) => {
	try {
		console.log('Starting schema generation')

		const entry = resolve(__dirname, `../services/${path}/src/application`)
		const outputFile = join(entry, `schema.json`)
		const routesEntry = join(entry, 'routes')

		const routesFiles = fs
			.readdirSync(routesEntry, { recursive: true })
			.filter((file) => file.toString().endsWith('.ts'))
			.map((file) => join(routesEntry, file.toString()))

		const jsonSchema = generateJSONSchema([/RouteDef$/], routesFiles, {
			tsConfigPath: resolve(__dirname, `../services/${path}/tsconfig.json`),
			options: {
				ignoreErrors: true,
			},
		})

		fs.mkdirSync(dirname(outputFile), { recursive: true })
		fs.writeFileSync(outputFile, JSON.stringify(jsonSchema))

		console.log(`Generated schema for ${path} service successfully`)
	} catch (error) {
		console.error(`Failed to generate schema for ${path} service: `, error)
	}
})
