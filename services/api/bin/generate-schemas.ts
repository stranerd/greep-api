import { generateJSONSchema } from 'equipped'
import fs from 'fs'
import * as path from 'path'

console.log('Starting schema generation')

const entry = path.resolve(__dirname, '../src/application/schemas/')
const outputFile = path.join(entry, `schema.json`)

const paths = [path.resolve(entry, '/')]

const jsonSchema = generateJSONSchema([/DefRoute$/], paths)

fs.mkdirSync(path.dirname(outputFile), { recursive: true })
fs.writeFileSync(outputFile, JSON.stringify(jsonSchema, null, 4))

console.log('Generated schema successfully')
