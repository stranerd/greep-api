const colors = {
	primaryBg: 'var(--clr-primaryBg)',
	primaryText: 'var(--clr-primaryText)',
	primaryHover: 'var(--clr-primaryHover)',
	bodyBg: 'var(--clr-bodyBg)',
	bodyText: 'var(--clr-bodyText)',
	itemBg: 'var(--clr-itemBg)',
	secondaryText: 'var(--clr-secondaryText)',
	disabled: 'var(--clr-disabled)',
	outlineHover: 'var(--clr-outlineHover)',
	contrast: 'var(--clr-contrast)',
	highlight: 'var(--clr-highlight)',
	success: 'var(--clr-success)',
	danger: 'var(--clr-danger)',
	info: 'var(--clr-info)',
	warning: 'var(--clr-warning)',
	royal: 'var(--clr-royal)'
}

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/application/**/*.{vue,js,jsx,tsx}'],
	darkMode: 'Media',
	theme: {
		screens: {
			sm: '640px',
			md: '768px',
			lg: '1280px',
			xl: '1420px',
			'2xl': '1536px'
		},
		extend: { colors }
	},
	plugins: []
}