module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true
	},
	extends: [
		'eslint:recommended',
		'@nuxtjs/eslint-config-typescript'
	],
	parserOptions: {
		ecmaVersion: 2021,
		parser: '@typescript-eslint/parser'
	},
	rules: {
		'no-console': 'warn',
		'no-debugger': 'warn',
		'no-empty-function': 'off',
		'no-undef': 'off',
		'vue/no-v-html': 'off',
		'no-tabs': 'off',
		'no-var': 'error',
		'no-use-before-define': 'off',
		indent: ['error', 'tab', { SwitchCase: 1 }],
		'no-mixed-spaces-and-tabs': ['off', 'smart-tabs'],
		semi: ['error', 'never'],
		quotes: ['error', 'single'],
		'prefer-const': ['error'],
		'arrow-parens': ['error', 'always'],
		'no-return-assign': 'off',
		curly: 'off',
		'object-property-newline': 'off',
		'require-atomic-updates': 'off',
		'require-await': 'off',
		'vue/multi-word-component-names': 'off',
		'vue/html-indent': ['warn', 'tab', {
			attribute: 1,
			baseIndent: 1,
			closeBracket: 0,
			alignAttributesVertically: true,
			ignores: []
		}]
	}
}
