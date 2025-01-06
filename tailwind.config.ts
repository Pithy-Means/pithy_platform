import type { Config } from "tailwindcss";
// import type { PluginAPI } from "tailwindcss/types/config";
import plugin from "tailwindcss/plugin";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				boxShadow: {
					'3xl': '0 40px 75px -10px rgba(0, 0, 0, 0.2)',
				},
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			screens: {
				'4k': '2560px', // 
				// '8k': '7680px'
			},

		},
		screens: {
			'md': '640px',
			'lg': '930px',
			'xl': '1440px',
			'2xl': '1536px',
			'3xl': '1920px',

		}
	},
	plugins: [require("tailwindcss-animate"),
		plugin(function ({ addUtilities }) {
		const newUtilities = {
			'.no-scrollbar': {
				/* Hide scrollbar for Chrome, Safari, and Edge */
				'&::-webkit-scrollbar': {
					display: 'none',
				},
				/* IE and Edge */
				'-ms-overflow-style': 'none',
				/* Firefox */
				'scrollbar-width': 'none',
			},
		};
		addUtilities(newUtilities);
	}),
	],
};
export default config;
