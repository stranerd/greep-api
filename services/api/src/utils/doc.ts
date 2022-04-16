import { createGenerator } from 'ts-json-schema-generator'
import fs from 'fs'
import { dirname } from 'path'

const config = {
	path: 'src/modules/*/domain/entities/*.ts',
	tsconfig: 'tsconfig.json',
	type: '*'
}

const outputPath = 'docs/data.json'

const schema = createGenerator(config).createSchema(config.type)
const schemaString = JSON.stringify(schema, null, 4)

const folder = dirname(outputPath)
if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true })

fs.writeFileSync(outputPath, schemaString)