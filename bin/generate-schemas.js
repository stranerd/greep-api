const { generateJSONSchema } = require('equipped')
const fs = require('fs')
const path = require('path')

console.log('Starting schema generation')

const entry = path.resolve(__dirname, '../services/api/src/application/schemas/')
const outputFile = path.join(entry, `schema.json`)

const paths = [
	path.resolve(entry, '/'),
];

const jsonSchema = generateJSONSchema([/DefRoute$/], paths)

fs.mkdirSync(path.dirname(outputFile), { recursive: true })
fs.writeFileSync(outputFile, JSON.stringify(jsonSchema, null, 4))

console.log('Generated schema successfully')
