// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path'

export default defineNuxtConfig({
	app: {
		baseURL: '/admin/',
		head: {
			title: 'Greep'
		}
	},
	ssr: false,
	srcDir: 'src/application',
	buildDir: 'build',
	alias: {
		'@app': resolve(__dirname, 'src/application'),
		'@modules': resolve(__dirname, 'src/modules'),
		'@utils': resolve(__dirname, 'src/utils')
	},
	components: [
		'@/components',
		'@/components/core',
		'@/components/core/forms',
		'@/components/core/loading',
		'@/components/core/text'
	],
	css: ['@/assets/styles/tailwind.css', '@/assets/styles/index.scss', 'primeicons/primeicons.css'],
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {}
		}
	},
	vite: {
		css: {
			preprocessorOptions: {
				sass: {
					additionalData: '@import "@/assets/styles/globals.sass"'
				}
			}
		}
	}
})
