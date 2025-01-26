const eslint = require('@eslint/js')
const stylistic = require('@stylistic/eslint-plugin')
const tsEslintPlugin = require('@typescript-eslint/eslint-plugin')
const tsEslintParser = require('@typescript-eslint/parser')
const prettier = require('eslint-plugin-prettier/recommended')
const promise = require('eslint-plugin-promise')
const globals = require('globals')

module.exports = [
	eslint.configs.recommended,
	prettier,
	{
		languageOptions: {
			globals: {
				...globals.node,
			},
			parser: tsEslintParser,
			parserOptions: {
				project: ['./services/*/tsconfig.json'],
				tsconfigRootDir: __dirname,
				sourceType: 'module',
				ecmaVersion: 2021,
			},
		},
		plugins: { promise, ts: tsEslintPlugin, style: stylistic },
		rules: {
			'prettier/prettier': 'error',
			'no-console': 'warn',
			'no-debugger': 'error',
			'no-tabs': 'off',
			'no-var': 'error',
			'accessor-pairs': 'off',
			'arrow-body-style': ['error', 'as-needed'],
			'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
			semi: ['error', 'never'],
			'style/semi': ['error', 'never'],
			'prefer-const': ['error'],
			'arrow-parens': ['error', 'always'],
			'no-return-assign': 'off',
			curly: 'off',
			'object-property-newline': 'off',
			'require-atomic-updates': 'off',
			'require-await': 'off',
			'no-unused-vars': 'off',
			'ts/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
		},
	},
].map((config) => ({
	...config,
	files: ['**/*.ts'],
	ignores: ["services/*/lib/**/*.js"],
}))
