export const COLORS = {
	background: '#e6f0ff',
	backgroundLight: '#F7F9FB',
	backgroundGrid: '#E6E6E6',
	primary: '#0073e6',
	primaryDark: '#4472C4',
	white: '#FFFFFF',
	black: '#000000'
} as const

export const SIZES = {
	snapGrid: [25, 25],
	providerHeight: '400px',

	defaultPageSize: 10,
	pageSizeOptions: [5, 10, 15, 20] as const,

	textFieldLarge: '552px',

	zIndexProvider: 9999
} as const

export const BUTTON_STYLES = {
	borderRadius: 10,
	heights: {
		sm: 36,
		md: 49,
		lg: 56
	},
	glass: {
		dark: {
			background: 'rgba(255, 255, 255, 0.1)',
			hover: 'rgba(255, 255, 255, 0.15)',
			text: 'rgba(255, 255, 255, 0.9)',
			textHover: 'rgba(255, 255, 255, 1)'
		},
		light: {
			background: 'rgba(0, 115, 230, 0.99)',
			hover: 'rgba(0, 115, 230, 0.81)',
			text: 'rgba(255, 255, 255, 0.9)',
			textHover: 'rgba(255, 255, 255, 1)'
		},
		blue: {
			background: 'rgba(0, 115, 230, 0.3)',
			hover: 'rgba(0, 115, 230, 0.5)',
			text: 'rgba(255, 255, 255, 0.9)',
			textHover: 'rgba(255, 255, 255, 1)'
		},
		danger: {
			background: 'rgb(211, 47, 47)',
			hover: 'rgba(211, 47, 47, 0.8)',
			text: 'rgba(255, 255, 255, 0.98)',
			textHover: '#FFFFFF'
		}
	},
	effects: {
		blur: 'blur(8px)',
		shadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
		shadowBlue: '0 2px 8px rgba(0, 115, 230, 0.2)',
		shadowDanger: '0 2px 10px rgba(211, 47, 47, 0.3)',
		transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
	}
} as const
