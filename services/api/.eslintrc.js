module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: ['eslint:recommended', 'eslint-config-prettier', 'plugin:prettier/recommended'],
	plugins: ['promise', '@typescript-eslint'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2021,
	},
	rules: {
		'prettier/prettier': 'error',
		'no-console': 'warn',
		'no-debugger': 'error',
		'no-tabs': 'off',
		'no-var': 'error',
		'accessor-pairs': 'off',
		'no-unused-vars': 0,
		'arrow-body-style': ['error', 'as-needed'],
		'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
		semi: ['error', 'never'],
		'@typescript-eslint/semi': ['error', 'never'],
		'prefer-const': ['error'],
		'arrow-parens': ['error', 'always'],
		'no-return-assign': 'off',
		curly: 'off',
		'object-property-newline': 'off',
		'require-atomic-updates': 'off',
		'require-await': 'off',
	},
	overrides: [
		{
			files: ['tests/**/*.[jt]s?(x)', 'tests/**/*.spec.[jt]s?(x)'],
			env: {
				jest: true,
			},
		},
	],
}
