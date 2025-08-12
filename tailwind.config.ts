import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		colors: {
			border: '#e2e8f0',
			input: '#f1f5f9',
			ring: '#cbd5e1',
			background: '#f8fafc',
			foreground: '#1e293b',
			primary: {
				DEFAULT: '#0725B5',
				foreground: '#ffffff',
			},
			secondary: {
				DEFAULT: '#F59E42',
				foreground: '#ffffff',
			},
			accent: {
				DEFAULT: '#42F5B3',
				foreground: '#0725B5',
			},
			muted: {
				DEFAULT: '#e2e8f0',
				foreground: '#64748b',
			},
			destructive: {
				DEFAULT: '#ef4444',
				foreground: '#ffffff',
			},
			popover: {
				DEFAULT: '#f1f5f9',
				foreground: '#1e293b',
			},
			card: {
				DEFAULT: '#ffffff',
				foreground: '#1e293b',
			},
			sidebar: {
				DEFAULT: '#0725B5',
				foreground: '#ffffff',
				primary: '#F59E42',
				'primary-foreground': '#0725B5',
				accent: '#42F5B3',
				'accent-foreground': '#0725B5',
				border: '#e2e8f0',
				ring: '#cbd5e1',
			},
		},
		borderRadius: {
			lg: 'var(--radius)',
			md: 'calc(var(--radius) - 2px)',
			sm: 'calc(var(--radius) - 4px)'
		},
		keyframes: {
			'accordion-down': {
				from: {
					height: '0'
				},
				to: {
					height: 'var(--radix-accordion-content-height)'
				}
			},
			'accordion-up': {
				from: {
					height: 'var(--radix-accordion-content-height)'
				},
				to: {
					height: '0'
				}
			}
		},
		animation: {
			'accordion-down': 'accordion-down 0.2s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out'
		}
	},
	plugins: [require("tailwindcss-animate")],
};

export default config;
